import styled from "styled-components";
import React from "react";
import {color} from "../../style/color";``

interface Props{
    options: string[];
    value: string;
    onChange: (value: string) => void;
    isDropdownActive: boolean;
    setIsDropdownActive: (value: boolean) => void;
}

const Dropdown: React.FC<Props> = ({options, value, onChange, isDropdownActive, setIsDropdownActive}) => {

    const toggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsDropdownActive(!isDropdownActive);
      };
    
      const select = (opt: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(opt);
        setIsDropdownActive(false);
      };
    
      React.useEffect(() => {
        const close = () => setIsDropdownActive(false);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
      }, [setIsDropdownActive]);

    return(
        <Wrapper>
            <Trigger onClick={toggle}>{value}</Trigger>

            {isDropdownActive && (
                <Menu role="listbox">
                {options.map((opt) => (
                    <Item key={opt} onClick={select(opt)} role="option">
                    {opt}
                    </Item>
                ))}
                </Menu>
            )}
        </Wrapper>
    )
}

export default Dropdown;

const Wrapper = styled.div`
  position: relative;      
  width: 150px;
  font-size: 1rem;         
`;

const Trigger = styled.button`
  width: 100%;
  height: 40px;
  padding: 6px 10px;
  border-radius: 10px;
  border: none;
  color: ${color.black};
  background: ${color.gray};
  text-align: left;
  cursor: pointer;
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

const Item = styled.div`
  padding: 8px 10px;
  cursor: pointer;
  
  &:hover { background: ${color.gray}; }
`;