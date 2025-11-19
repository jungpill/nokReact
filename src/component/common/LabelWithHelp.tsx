import styled from "styled-components";
import { IoIosHelp } from "react-icons/io";
import { color } from "../../style/color";

interface Props {
  label: string;
  content: string;
  placement?: "top" | "bottom"; // 선택: 기본 top
  width: number;
}

const LabelWithHelp: React.FC<Props> = ({ label, content, placement = "top", width }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <HelpContainer tabIndex={0}>
        <HelpIcon />
        <TooltipBox $placement={placement} width={width}>{content}</TooltipBox>
      </HelpContainer>
    </Wrapper>
  );
};

export default LabelWithHelp;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Label = styled.div`
  font-weight: 700;
`;

const HelpIcon = styled(IoIosHelp)`
  color: ${color.white};
  background-color: #274654;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

/* 아이콘 래퍼: hover/focus 시 Tooltip 보이기 */
const HelpContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  /* hover 또는 키보드 focus 시 표시 */
  &:hover > div,
  &:focus-within > div {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
`;

/* 툴팁 박스 */
const TooltipBox = styled.div<{ $placement: "top" | "bottom", width: number }>`
  position: absolute;
  left: 50%;
  ${p => (p.$placement === "top" ? "bottom: calc(100% + 8px);" : "top: calc(100% + 8px);")}
  transform: translateX(-50%) ${p => (p.$placement === "top" ? "translateY(6px)" : "translateY(-6px)")};
  z-index: 1000;

  border-radius: 20px;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 20px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: ${p => p.width}px;

  /* 기본 숨김 */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;

  /* 내용 줄바꿈 */
  color: #111;
  line-height: 1.4;
  word-break: keep-all;
`;
