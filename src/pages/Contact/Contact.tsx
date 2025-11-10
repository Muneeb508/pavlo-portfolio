import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '../../components/ContactForm/ContactForm';
import GoogleSearch from '../../components/GoogleSearch/GoogleSearch';
import {
  AdditionalWrapper,
  ContactContainer,
  ContactTitel,
  WrapperInfo,
  SocialContainerLink,
  TextContact,
  EmailSocialLink,
  LocationContainer,
  LocationLink,
} from './Contact.styled';

const Contact: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact</title>
        <meta name="description" content="Contact Pavlo Troph — inquiries, collaborations, and freelance/studio opportunities." />
        <meta property="og:title" content="Contact" />
        <meta property="og:description" content="Contact Pavlo Troph — inquiries, collaborations, and freelance/studio opportunities." />
        <meta property="og:url" content="https://pavlo-protfolio.vercel.app/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact | Pavlo Troph Portfolio" />
        <meta name="twitter:description" content="Contact Pavlo Troph — inquiries, collaborations, and freelance/studio opportunities." />
      </Helmet>
      
      <AdditionalWrapper>
        <ContactContainer>
          <h1>Contact</h1>
          <GoogleSearch />
          <ContactTitel as="h2">Let's Talk</ContactTitel>
          <WrapperInfo>
            <SocialContainerLink>
              <TextContact>Contact</TextContact>
              <EmailSocialLink href="mailto:info@pavlotroph.com" aria-label="Send email to info@pavlotroph.com">
                info@pavlotroph.com
              </EmailSocialLink>
              <EmailSocialLink href="https://www.linkedin.com/in/pavlo-trofimenko/" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile (opens in new tab)">
                LinkedIn<span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.7 }} aria-hidden="true" title="Opens in new tab">↗</span>
              </EmailSocialLink>
              <EmailSocialLink href="https://t.me/pavlotroph" target="_blank" rel="noopener noreferrer" aria-label="Contact on Telegram (opens in new tab)">
                Telegram<span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.7 }} aria-hidden="true" title="Opens in new tab">↗</span>
              </EmailSocialLink>
              <EmailSocialLink href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram profile (opens in new tab)">
                Instagram<span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.7 }} aria-hidden="true" title="Opens in new tab">↗</span>
              </EmailSocialLink>
            </SocialContainerLink>
            <LocationContainer>
              <TextContact>Location</TextContact>
              <LocationLink
                href="https://maps.app.goo.gl/b7UCDY41c7FuzzFC6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View location on Google Maps (opens in new tab)"
              >
                Toronto, ON, CA<span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.7 }} aria-hidden="true" title="Opens in new tab">↗</span>
              </LocationLink>
            </LocationContainer>
          </WrapperInfo>
          <ContactForm />
        </ContactContainer>
      </AdditionalWrapper>
    </>
  );
};

export default Contact;
