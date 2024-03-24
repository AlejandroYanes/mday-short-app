import { Flex, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'monday-ui-react-core';
import { useQuery } from '@tanstack/react-query';

import { usersAPI } from '../../api/users';
import TableEmptyState from '../../components/empty-state';
import TableErrorState from '../../components/error-state';

const columns = [
  {
    id: 'name',
    loadingStateType: 'medium-text',
    title: 'Name',
    width: 440,
  },
  {
    id: 'role',
    loadingStateType: 'medium-text',
    title: 'Role',
    width: 280,
  },
  {
    id: 'status',
    loadingStateType: 'medium-text',
    title: 'Status',
    width: 200,
  },
];

export default function UsersList() {
  const { data } = useQuery({ queryKey: ['links'], queryFn: usersAPI.list });
  const results = data?.results || [];

  return (
    <>
      <div>
        New user
      </div>
      <div className="table-container">
        <Table columns={columns} emptyState={<TableEmptyState/>} errorState={<TableErrorState/>}>
          <TableHeader>
            <TableHeaderCell title="Name"/>
            <TableHeaderCell title="Role" className="table-cell--center"/>
            <TableHeaderCell title="Status" className="table-cell--center"/>
            <TableHeaderCell title="" className="table-cell--center"/>
          </TableHeader>
          <TableBody>
            {results.map((user) => (
              <TableRow key={user.id} className="table-row">
                <TableCell>
                  {user.name}
                </TableCell>
                <TableCell className="table-cell--center">
                  {user.role}
                </TableCell>
                <TableCell className="table-cell--center">{user.status}</TableCell>
                <TableCell className="table-cell--center">
                  <Flex gap="12">
                    Delete
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
