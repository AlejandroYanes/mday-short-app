import { Button, Flex, Skeleton } from 'monday-ui-react-core';

export default function SkeletonCard() {
  return (
    <div className="domain_card">
      <Flex align={Flex.align.CENTER} justify={Flex.justify.SPACE_BETWEEN}>
        <a href="/#" className="domain_card__link">
          <Flex align={Flex.align.CENTER} gap={Flex.gaps.XS}>
            <Skeleton width="180px" height="20px"/>
          </Flex>
        </a>
        <Flex gap={Flex.gaps.SMALL}>
          <Button
            kind={Button.kinds.SECONDARY}
            disabled
          >
            Refresh
          </Button>
          <Button
            kind={Button.kinds.SECONDARY}
            color={Button.colors.NEGATIVE}
            disabled
          >
            Remove
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
