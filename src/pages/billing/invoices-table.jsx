import {
  Button,
  Flex,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
  Label,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { ExternalPage } from 'monday-ui-react-core/icons';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '../../utils/dates';
import { billingAPI } from '../../api/billling';
import TableEmptyState from '../../components/empty-state';
import TableErrorState from '../../components/error-state';
import RenderIf from '../../components/render-if';

const columns = [
  {
    id: 'invoice-date',
    loadingStateType: 'medium-text',
    title: 'Invoice Date',
    width: 220,
  },
  {
    id: 'status',
    loadingStateType: 'medium-text',
    title: 'Status',
    width: 100,
  },
  {
    id: 'amount',
    loadingStateType: 'medium-text',
    title: 'Amount',
    width: 100,
  },
  {
    id: 'card-details',
    loadingStateType: 'medium-text',
    title: 'Card used',
    // width: 200,
  },
  {
    id: 'actions',
    loadingStateType: 'medium-text',
    title: '',
    width: 80,
  },
];

const resolveColor = (status) => {
  switch (status) {
    case 'paid':
      return Label.colors.POSITIVE;
    case 'failed':
      return Label.colors.NEGATIVE;
    default:
      return Label.colors.DARK;
  }
}

export default function InvoicesTable() {
  const { data: results = [] } = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: billingAPI.listInvoices,
    refetchOnWindowFocus: 'always',
    refetchInterval: 1000 * 60 * 60,
  });

  return (
    <div>
      <Table columns={columns} emptyState={<TableEmptyState/>} errorState={<TableErrorState/>}>
        <TableHeader>
          <TableHeaderCell title="Invoice Date"/>
          <TableHeaderCell title="Status" className="table-cell--center"/>
          <TableHeaderCell title="Amount" className="table-cell--right"/>
          <TableHeaderCell title="Card used"/>
          <TableHeaderCell title="" className="table-cell--center"/>
        </TableHeader>
        <TableBody>
          {results.map((invoice) => (
            <TableRow key={invoice.id} className="table-row">
              <TableCell>
                <Text type={Text.types.TEXT1} element="p">
                  <span>{formatDate(invoice.createdAt)}</span>
                </Text>
              </TableCell>
              <TableCell className="capitalize table-cell--center">
                <Label
                  text={invoice.cardBrand === '----' ? 'Trial' : invoice.status}
                  kind={Label.kinds.LINE}
                  color={resolveColor(invoice.status)}
                />
              </TableCell>
              <TableCell className="table-cell--right">
                <Text type={Text.types.TEXT1} element="p">
                  {invoice.cardBrand === '----' ? '----' : `$${invoice.total/100}`}
                </Text>
              </TableCell>
              <TableCell>
                <Text type={Text.types.TEXT1} element="p">
                  <RenderIf condition={invoice.cardBrand !== '----'} fallback="----">
                    <span className="capitalize" style={{marginRight: '4px'}}>{invoice.cardBrand}</span>
                    <span>{`ending in ${invoice.cardDigits}`}</span>
                  </RenderIf>
                </Text>
              </TableCell>
              <TableCell className="table-cell--center">
                <Flex gap="12">
                  <a href={invoice.url} target="_blank" rel="noreferrer">
                    <Tooltip content="View Invoice" position={Tooltip.positions.LEFT} withMaxWidth>
                      <IconButton
                        icon={ExternalPage}
                        size={Button.sizes.XS}
                        kind={Button.kinds.SECONDARY}
                      />
                    </Tooltip>
                  </a>
                </Flex>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
