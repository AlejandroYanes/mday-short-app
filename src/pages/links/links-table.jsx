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
import { useAuth } from '../../providers/auth';
import TableEmptyState from '../../components/empty-state';
import TableErrorState from '../../components/error-state';
import RenderIf from '../../components/render-if';
import NewLinkModal from './new-link-modal';
import EditLinkModal from './edit-link-modal';
import DeleteLinkModal from './delete-link-modal';
import CopyToClipboard from './copy-to-clipboard';

const columns = [
  {
    id: 'baseLink',
    loadingStateType: 'medium-text',
    title: 'Link',
    // width: 440,
  },
  {
    id: 'slug',
    loadingStateType: 'medium-text',
    title: 'Short name',
    width: 200,
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

const resolveShortLink = (link) => {
  const { slug, wslug, domain } = link;
  return domain ? `https://${domain}/${slug}` : `${BASE_URL}/${wslug}/${slug}`;
};

export default function LinksTable() {
  const { role } = useAuth();

  const { data } = useQuery({ queryKey: ['links'], queryFn: linksAPI.list });
  const results = data?.results || [];

  return (
    <div className="page page--large">
      <div style={{ height: 40 }}>
        <RenderIf condition={role !== 'GUEST'}>
          <NewLinkModal />
        </RenderIf>
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
                  <Link href={resolveShortLink(link)} text={link.slug} />
                </TableCell>
                <TableCell>{link.password || '-'}</TableCell>
                <TableCell>{link.expiresAt ? formatDate(link.expiresAt) : '-'}</TableCell>
                <TableCell className="table-cell--center">
                  <Flex gap="12">
                    <CopyToClipboard link={link} />
                    <RenderIf condition={role !== 'GUEST'}>
                      <EditLinkModal link={link}/>
                      <DeleteLinkModal link={link}/>
                    </RenderIf>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
