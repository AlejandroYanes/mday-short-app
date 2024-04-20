import { useState } from 'react';
import { Flex, Text } from 'monday-ui-react-core';

function getSubdomain(domain, apexName) {
  return domain.slice( 0, domain.length - apexName.length - 1);
}

function getVerificationError(verificationResponse) {
  try {
    const error = verificationResponse.error
    if (error.code === 'missing_txt_record') {
      return null
    }
    return error.message
  } catch {
    return null
  }
}

export default function ConfigSection({ domain, domainInfo }) {
  const [recordType, setRecordType] = useState('CNAME');

  if (!domainInfo) {
    return (
      <div className="domain_card__config">
        <Flex gap={Flex.gaps.SMALL} align={Flex.align.CENTER}>
          <div className="domain_card__loading_circle"/>
          <Text type={Text.types.TEXT1}>
            Loading Configuration
          </Text>
        </Flex>
      </div>
    );
  }

  if (!domainInfo.verified) {
    const txtVerification = domainInfo.verification.find(
      (x) => x.type === 'TXT'
    )
    return (
      <div className="domain_card__config">
        <Flex align={Flex.align.CENTER} gap={Flex.gaps.SMALL}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
          >
            <circle cx="12" cy="12" r="10" fill="#EAB308"/>
            <path d="M12 8v4" stroke="white"/>
            <path d="M12 16h.01" stroke="white"/>
          </svg>
          <Text type={Text.types.TEXT1}>
            Domain is pending verification
          </Text>
        </Flex>

        <div className="domain_card__divider"/>

        <button className="domain_card__tab-button">
          Verify Domain Ownership
        </button>
        <Text element="p" type={Text.types.TEXT1}>
          Please set the following TXT record on {domainInfo.apexName} to
          prove ownership of {domainInfo.name}:
        </Text>

        <div className="domain_card__block">
          <div>
            <p>Type</p>
            <p>{txtVerification.type}</p>
          </div>
          <div>
            <p>Name</p>
            <p>
              {getSubdomain(txtVerification.domain, domainInfo.apexName)}
            </p>
          </div>
          <div>
            <p>Value</p>
            <p>
              {txtVerification.value}
            </p>
          </div>
        </div>

        {getVerificationError(domainInfo.verificationResponse)
          ? (
            <Text type={Text.types.TEXT2} style={{ color: 'var(--negative-color)' }}>
              {getVerificationError(domainInfo.verificationResponse)}
            </Text>
          ) : null}
      </div>
    )
  }

  return (
    <div className="domain_card__config">
      <Flex align={Flex.align.CENTER} gap={Flex.gaps.SMALL}>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={domainInfo.configured ? '#1976d2' : '#d32f2f'}
          />
          {domainInfo.configured ? (
            <>
              <path
                d="M8 11.8571L10.5 14.3572L15.8572 9"
                fill="none"
                stroke="white"
              />
            </>
          ) : (
            <>
              <path d="M15 9l-6 6" stroke="white" />
              <path d="M9 9l6 6" stroke="white" />
            </>
          )}
        </svg>
        <Text
          type={Text.types.TEXT1}
        >
          {domainInfo.configured ? 'Valid' : 'Invalid'} Configuration
        </Text>
      </Flex>

      {!domainInfo.configured && (
        <>
          <div className="domain_card__divider"/>

          <Flex align={Flex.align.CENTER} gap={Flex.gaps.SMALL}>
            <button
              onClick={() => setRecordType('CNAME')}
              className={`domain_card__tab-button ${
                recordType === 'CNAME' ? '' : 'domain_card__tab-button--inactive'
              }`}
            >
              CNAME Record (subdomains)
            </button>
            <button
              onClick={() => setRecordType('A')}
              className={`domain_card__tab-button ${
                recordType === 'A' ? '' : 'domain_card__tab-button--inactive'
              }`}
            >
              A Record (apex domain)
            </button>
          </Flex>
          <Text type={Text.types.TEXT1} element="p">
            Set the following record on your DNS provider to continue:
          </Text>
          <div className="domain_card__block">
            <div>
              <p>Type</p>
              <p>{recordType}</p>
            </div>
            <div>
              <p>Name</p>
              <p>
                {recordType === 'CNAME' ? getSubdomain(domain, domainInfo.apexName) : '@'}
              </p>
            </div>
            <div>
              <p>Value</p>
              <p>
                {recordType === 'CNAME' ? `cname.vercel-dns.com.` : `76.76.21.21`}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
