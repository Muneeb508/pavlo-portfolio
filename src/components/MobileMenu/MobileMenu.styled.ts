import { motion } from "framer-motion";
import styled from "styled-components";

// Styled Components
export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    z-index: 101;
    position: relative;

        @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){
display: none;

}
`;

export const BurgerButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 101;
  padding: 0;
  position: relative;

      @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){


}
`;

export const Line = styled(motion.div)`
  width: 40px;
  height: 2px;
  background: #ffffff;
  border-radius: 0px;
  z-index: 101;
  position: relative;

       @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){


}
`;

export const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.96);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  box-sizing: border-box;

      @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){


}
`;

export const MenuLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
`;

export const ButtonWrapp = styled.div`
position: absolute;
width: 300px;
 left: 50%;
 transform: translateX(-50%);
 bottom: 10%;

     @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){


}
`;

export const MenuLink = styled(motion.span)`
 font-family: var(--font-family);
font-weight: 400;
font-size: 24px;
line-height: 135%;
text-align: center;
color: var(--white);
  margin: 0;
  padding: 12px 0;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.8s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  &:hover {
    color: #fe5b14;
  }
  
  a, & > * {
    display: inline-block;
    text-align: center;
    width: auto;
    margin: 0 auto;
  }

      @media screen and (min-width: 744px){


}

@media screen and (min-width: 1440px){
font-family: var(--font-family);
font-weight: 400;
font-size: 18px;
line-height: 135%;
text-align: center;
color: var(--white);

}
`;

export const IconsStars =  styled.img`
width: 20px;

`;