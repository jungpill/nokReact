import styled from "styled-components";
import React from "react";
import { AiOutlineCaretUp } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { color } from "../../style/color";

interface Props<T> {
  options: T[];
  value: string;
  onChange: (val: string) => void;
  isDropdownActive: boolean;
  setIsDropdownActive: (value: boolean) => void;
  setSelectedId: (item: string) => void;
  labelKey: keyof T;
  valueKey: keyof T; 
}

const Dropdown = <T extends Record<string, any>>({
  options,
  value,
  onChange,
  isDropdownActive,
  setIsDropdownActive,
  setSelectedId,
  labelKey,
  valueKey,
}: Props<T>) => {
  
  const toggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDropdownActive(!isDropdownActive);
  };

  const select = (opt: T) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(opt[labelKey] as string);
    setSelectedId(String(opt[valueKey]));
    setIsDropdownActive(false);
  };

  return (
    <Wrapper>
      <Trigger onClick={toggle}>
        {value} <Icon isDropdownActive={isDropdownActive} />
      </Trigger>
      {isDropdownActive && (
        <Menu role="listbox">
          <SearchWrapper>
            <SearchInput type="text" placeholder="검색" />
            <SearchIcon />
          </SearchWrapper>
          {options.map((opt) => (
            <Item key={String(opt[valueKey])} onClick={select(opt)} role="option">
              {opt[labelKey]}
            </Item>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default Dropdown;

const Wrapper = styled.div`
  position: relative;      
  width: 150px;
  font-size: 1rem;         
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);   
  left: 0;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px 0;
  background: ${color.white};
  border: 1px solid ${color.gray};
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  z-index: 100;           
`;

const SearchWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
`

const SearchInput = styled.input`
    width: 100%;
    height: 40px;
    border-radius: 10px;
    border: none;
    padding: 6px 8px;
    background-color: ${color.gray};
`
const Trigger = styled.button`
  width: 100%;
  height: 40px;
  padding: 6px 10px;
  border-radius: 10px;
  border: none;
  color: ${color.black};
  background: ${color.gray};
  cursor: pointer;
  display: flex;
  align-items: center;

  /* 텍스트 ... 처리 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Item = styled.div`
  padding: 8px 10px;
  cursor: pointer;

  /* 텍스트 ... 처리 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  &:hover { background: ${color.gray}; }
`;

const SearchIcon = styled(CiSearch)`
    position: absolute;
    right: 20px;
    color: black;
    width: 20px;
    height: 20px;
`

const Icon = styled(AiOutlineCaretUp)<{isDropdownActive: boolean}>`
  transform: ${({isDropdownActive}) => isDropdownActive ? 'rotate(0deg)' : 'rotate(180deg)'};
  margin-left: auto;
`;