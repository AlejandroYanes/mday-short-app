import { Flex, Link, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, } from 'monday-ui-react-core';
import { useQuery } from '@tanstack/react-query';

import { linksAPI } from '../api/links';
import { BASE_URL } from '../utils/constants';
import { formatDate } from '../utils/dates';
import NewLinkModal from './new-link-modal';
import EditLinkModal from './edit-link-modal';
import DeleteLinkModal from './delete-link-modal';
import CopyToClipboard from './copy-to-clipboard';

const TableEmptyState = () => <h1 style={{ textAlign: 'center' }}>Empty State</h1>;
const TableErrorState = () => <h1 style={{ textAlign: 'center' }}>Error State</h1>;

const columns = [
  {
    id: 'baseLink',
    loadingStateType: 'medium-text',
    title: 'Board Link',
    width: 440,
  },
  {
    id: 'slug',
    loadingStateType: 'medium-text',
    title: 'Short name',
    width: 280,
  },
  {
    id: 'password',
    loadingStateType: 'medium-text',
    title: 'Visitors',
    width: 200,
  },
  {
    id: 'expiresAt',
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
            <TableHeaderCell title="Short name"/>
            <TableHeaderCell title="Password"/>
            <TableHeaderCell title="Expires On"/>
            <TableHeaderCell title="" className="table-cell--center"/>
          </TableHeader>
          <TableBody>
            {results.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <span className="link-cell__label">
                    {link.url}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`${BASE_URL}/visit/${link.slug}`} text={link.slug} />
                </TableCell>
                <TableCell>{link.password || '-'}</TableCell>
                <TableCell>{link.expiresAt ? formatDate(link.expiresAt) : '-'}</TableCell>
                <TableCell className="table-cell--center">
                  <Flex gap="12">
                    <CopyToClipboard link={link} />
                    <EditLinkModal link={link}/>
                    <DeleteLinkModal link={link}/>
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
