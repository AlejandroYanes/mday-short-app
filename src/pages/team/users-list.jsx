import {
  Dropdown,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow, Text
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { useQuery } from '@tanstack/react-query';

import { usersAPI } from '../../api/users';
import { monday } from '../../utils/monday';
import { queryClient } from '../../utils/query';
import { useAuth } from '../../providers/auth';
import TableEmptyState from '../../components/empty-state';
import TableErrorState from '../../components/error-state';
import DeleteUserModal from './delete-user-modal';
import InviteUserModal from './invite-user-modal';

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
    width: 220,
  },
  {
    id: 'status',
    loadingStateType: 'medium-text',
    title: 'Status',
    width: 200,
  },
  {
    id: 'actions',
    loadingStateType: 'medium-text',
    title: '',
    width: 120,
  },
];

const roleOptions = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'USER', label: 'User' },
  { value: 'GUEST', label: 'Guest' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const pendingOption = { value: 'PENDING', label: 'Pending' };
const invitedOption = { value: 'INVITED', label: 'Invited' };

const resolveOptionValue = (value) => {
  if (value === invitedOption.value) return invitedOption;
  if (value === pendingOption.value) return pendingOption;

  return statusOptions.find((op) => op.value === value);
};

export default function UsersList() {
  const { email: currentUser } = useAuth();
  const { data } = useQuery({ queryKey: ['users'], queryFn: usersAPI.list });
  const results = data?.results || [];

  const handleRoleChange = async (id, role) => {
    const previousRole = results.find((user) => user.id === id).role;

    try {
      queryClient.setQueryData(['users'], (oldData) => ({
        results: oldData.results.map((user) => (
          user.id === id ? { ...user, role: role.value } : user
        )),
      }));
      const response = await usersAPI.changeRole(id, role);

      if (response.ok) {
        await monday.execute('notice', {
          message: 'Role updated successfully!',
          type: 'success',
          timeout: 2500,
        });
      } else {
        throw new Error('Failed to update role');
      }
    } catch (err) {
      queryClient.setQueryData(['users'], (oldData) => ({
        results: oldData.results.map((user) => (
          user.id === id ? { ...user, role: previousRole } : user
        )),
      }));
      await monday.execute('notice', {
        message: 'Something went wrong!',
        type: 'error',
        timeout: 2500,
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    const previousStatus = results.find((user) => user.id === id).status;

    try {
      queryClient.setQueryData(['users'], (oldData) => ({
        results: oldData.results.map((user) => (
          user.id === id ? { ...user, status } : user
        )),
      }));
      const response = await usersAPI.changeStatus(id, status);

      if (response.ok) {
        await monday.execute('notice', {
          message: 'Status updated successfully!',
          type: 'success',
          timeout: 2500,
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      queryClient.setQueryData(['users'], (oldData) => ({
        results: oldData.results.map((user) => (
          user.id === id ? { ...user, status: previousStatus } : user
        )),
      }));
      await monday.execute('notice', {
        message: 'Something went wrong!',
        type: 'error',
        timeout: 2500,
      });
    }
  }

  return (
    <>
      <div>
        <InviteUserModal />
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
                  <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
                    <Text type={Text.types.TEXT1}>{user.name}</Text>
                    <Text type={Text.types.TEXT2}>{user.email}</Text>
                  </Flex>
                </TableCell>
                <TableCell className="table-cell--center">
                  <Dropdown
                    className="table-dropdown"
                    clearable={false}
                    searchable={false}
                    disabled={user.email === currentUser}
                    menuPortalTarget={document.body}
                    options={roleOptions}
                    value={roleOptions.find((op) => op.value === user.role)}
                    onChange={(option) => handleRoleChange(user.id, option.value)}
                  />
                </TableCell>
                <TableCell className="table-cell--center">
                  <Dropdown
                    className="table-dropdown"
                    clearable={false}
                    searchable={false}
                    disabled={user.email === currentUser}
                    menuPortalTarget={document.body}
                    options={statusOptions}
                    value={resolveOptionValue(user.status)}
                    onChange={(option) => handleStatusChange(user.id, option.value)}
                  />
                </TableCell>
                <TableCell className="table-cell--center">
                  <Flex gap="12">
                    <DeleteUserModal user={user} disabled={user.email === currentUser}/>
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
