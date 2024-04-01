import {
  Flex,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from 'monday-ui-react-core';
import { useQuery } from '@tanstack/react-query';

import { linksAPI } from '../../api/links';
import { BASE_URL } from '../../utils/constants';
import { formatDate } from '../../utils/dates';
import TableEmptyState from '../../components/empty-state';
import TableErrorState from '../../components/error-state';
import NewLinkModal from './new-link-modal';
import EditLinkModal from './edit-link-modal';
import DeleteLinkModal from './delete-link-modal';
import CopyToClipboard from './copy-to-clipboard';

const columns = [
  {
    id: 'baseLink',
    loadingStateType: 'medium-text',
    title: 'Link',
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
    id: 'actions',
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
      <div>
        <NewLinkModal />
      </div>
      <div className="table-container">
        <Table columns={columns} emptyState={<TableEmptyState/>} errorState={<TableErrorState/>}>
          <TableHeader>
            <TableHeaderCell title="Url"/>
            <TableHeaderCell title="Short name"/>
            <TableHeaderCell title="Password"/>
            <TableHeaderCell title="Expires On"/>
            <TableHeaderCell title="" className="table-cell--center"/>
          </TableHeader>
          <TableBody>
            {results.map((link) => (
              <TableRow key={link.id} className="table-row">
                <TableCell>
                  <Text type={Text.types.TEXT1} element="p" className="link-cell__label">
                    {link.url}
                  </Text>
                </TableCell>
                <TableCell>
                  <Link href={`${BASE_URL}/${link.wslug}/${link.slug}`} text={link.slug} />
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
