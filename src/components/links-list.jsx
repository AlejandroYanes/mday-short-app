import {
  Button,
  Flex,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tooltip,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Attach, Delete } from 'monday-ui-react-core/icons';
import { useQuery } from '@tanstack/react-query';

import { linksAPI } from '../api/links';
import { BASE_URL } from '../utils/constants';
import { formatDate } from '../utils/dates';
import NewLinkModal from './new-link-modal';
import EditLinkModal from './edit-link-modal';

const TableEmptyState = () => <h1 style={{ textAlign: 'center' }}>Empty State</h1>;
const TableErrorState = () => <h1 style={{ textAlign: 'center' }}>Error State</h1>;

const columns = [
  {
    id: 'baseLink',
    loadingStateType: 'medium-text',
    title: 'Board Link',
    width: 380,
  },
  {
    id: 'slug',
    loadingStateType: 'medium-text',
    title: 'Short name',
    width: 150,
  },
  {
    id: 'visitors',
    loadingStateType: 'medium-text',
    title: 'Visitors',
    width: 150,
  },
  {
    id: 'views',
    loadingStateType: 'medium-text',
    title: 'Views',
    width: 150,
  },
  {
    id: 'preview',
    loadingStateType: 'medium-text',
    title: '',
    width: 120,
  },
];

export default function LinksList() {
  const { data } = useQuery({ queryKey: ['links'], queryFn: linksAPI.list });
  const results = data?.results || [];

  return (
    <>
      <div className="tool-bar">
        <NewLinkModal />
      </div>
      <div className="table-container">
        <Table columns={columns} emptyState={<TableEmptyState/>} errorState={<TableErrorState/>}>
          <TableHeader>
            <TableHeaderCell title="Board Url"/>
            <TableHeaderCell title="Short name" className="table-cell--center"/>
            <TableHeaderCell title="Password" className="table-cell--center"/>
            <TableHeaderCell title="Expires On" className="table-cell--center"/>
            <TableHeaderCell title="" className="table-cell--center"/>
          </TableHeader>
          <TableBody>
            {results.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  {link.url}
                </TableCell>
                <TableCell className="table-cell--center">
                  <Link href={`${BASE_URL}/visit/${link.slug}`} text={link.slug} />
                </TableCell>
                <TableCell className="table-cell--center">{link.password || '-'}</TableCell>
                <TableCell className="table-cell--center">{link.expiresAt ? formatDate(link.expiresAt) : '-'}</TableCell>
                <TableCell className="table-cell--center">
                  <Flex gap="12">
                    <IconButton icon={Attach} size={Button.sizes.XS} kind={Button.kinds.SECONDARY}/>
                    <EditLinkModal link={link}/>
                    <IconButton icon={Delete} size={Button.sizes.XS} kind={Button.kinds.SECONDARY}/>
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
