import styled from 'styled-components';

export const GoogleSearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

export const SearchForm = styled.form`
  display: flex;
  gap: 8px;
  max-width: 400px;
  width: 100%;
`;

export const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #333;
  background: #1a1a1a;
  color: #fff;
  border-radius: 4px;
  font-size: 1rem;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #00d1ff;
  }

  &::placeholder {
    color: #808080;
  }
`;

export const SearchButton = styled.button`
  padding: 10px 24px;
  background: #00d1ff;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #00ffe7;
  }

  &:active {
    transform: scale(0.98);
  }
`;

