import React, { useState } from "react";
import styled, { css } from "styled-components";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = "top", disabled }) => {
  const [visible, setVisible] = useState(false);

  if (disabled) return <>{children}</>; // disabled면 툴팁 안뜸

  return (
    <Wrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <TooltipBox placement={placement}>{content}</TooltipBox>}
    </Wrapper>
  );
};

export default Tooltip;

// styled-components
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipBox = styled.div<{ placement: "top" | "bottom" | "left" | "right" }>`
  position: absolute;
  background-color: #fff;
  color: #000;
  padding: 6px 10px;
  border: 1px solid #000;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  ${({ placement }) =>
    placement === "top" &&
    css`
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
    `}

  ${({ placement }) =>
    placement === "bottom" &&
    css`
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    `}

  ${({ placement }) =>
    placement === "left" &&
    css`
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 8px;
    `}

  ${({ placement }) =>
    placement === "right" &&
    css`
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
    `}
`;