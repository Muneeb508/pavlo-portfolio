import styled from "styled-components";

export const AdditionalWrapper = styled.div`
padding: 0px 18px;

@media screen and (min-width: 744px){
padding: 0px 24px;
}
`;

export const ContactContainer = styled.div`
margin: 0 auto 10px;
height: 100%;
max-width: 1440px;
padding: 16px 0px;
display: flex;
flex-direction: column;
margin-bottom: 16px;

@media screen and (min-width: 744px){
margin-bottom: 20px;
}

@media screen and (min-width: 1440px){

height: 100%;
max-width: 1440px;
padding: 16px 0px;
display: flex;
flex-direction: column;
margin-bottom: 24px;
}
`;

export const ContactTitel = styled.h1`
font-family: var(--font-family);
font-weight: 600;
font-size: 32px;
line-height: 162%;
color: #fff;
`;

export const WrapperInfo = styled.div`
display: flex;
flex-direction: column;
gap: 30px;
margin-top: 50px;
margin-bottom: 50px;

@media screen and (min-width: 744px){
  flex-direction: row;
  gap: 80px;
  justify-content: flex-start;
  align-items: flex-start;
}

@media screen and (min-width: 1440px){
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 120px;
  margin-top: 50px;
}


`;

export const SocialContainerLink = styled.div`
display: flex;
flex-direction: column;
gap: 5px;
`;

export const TextContact = styled.p`
font-family: var(--second-family);
font-weight: 400;
font-size: 11px;
letter-spacing: -0.02em;
color: #808080;

@media screen and (min-width: 744px){
font-family: var(--second-family);
font-weight: 400;
font-size: 13px;
letter-spacing: -0.02em;
color: #808080;
margin-bottom: 30px;
}

@media screen and (min-width: 1440px){
font-size: 16px;
margin-bottom: 50px;

}
`;

export const EmailSocialLink = styled.a`
font-family: var(--font-family);
font-weight: 600;
font-size: 14px;
line-height: 162%;
color: #fff;
@media screen and (min-width: 744px){
font-size: 16px;

}

@media screen and (min-width: 1440px){
font-size: 20px;

}
`;

export const LocationContainer = styled.div`

display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;
`;

export const LocationLink = styled.a`
font-family: var(--font-family);
font-weight: 600;
font-size: 14px;
line-height: 162%;
color: #fff;
@media screen and (min-width: 744px){
font-size: 16px;

}

@media screen and (min-width: 1440px){
font-size: 20px;

}
`;
