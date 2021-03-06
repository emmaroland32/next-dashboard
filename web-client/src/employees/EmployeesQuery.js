import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { graphql } from "react-relay";
import { QueryRenderer } from "../app/providers/RelayProvider";
import ErrorMessage from "../app/errors/ErrorMessage";
import Employees from "./EmployeesContainer";
import { employeesSelectors } from "./state";

export const query = graphql`
  query EmployeesQueryQuery(
    $sortBy: EmployeeSortBy
    $sortDir: EmployeeSortDir
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    viewer {
      ...EmployeesContainer_viewer
        @arguments(
          sortBy: $sortBy
          sortDir: $sortDir
          first: $first
          after: $after
          last: $last
          before: $before
        )
    }
  }
`;

let retryCallback;
function doRetry() {
  if (retryCallback) retryCallback();
}

function EmployeesQuery() {
  const params = useSelector(state => employeesSelectors.getTableParams(state));

  const renderQuery = useCallback(({ error, props: renderProps, retry }) => {
    if (error) return <ErrorMessage error={error} />;

    retryCallback = retry;

    return (
      <Employees
        viewer={(renderProps && renderProps.viewer) || null}
        retry={doRetry}
      />
    );
  }, []);

  return (
    <QueryRenderer query={query} variables={params} render={renderQuery} />
  );
}

export default EmployeesQuery;
