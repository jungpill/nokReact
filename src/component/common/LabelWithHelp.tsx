import styled from "styled-components";
import { IoIosHelp } from "react-icons/io";
import { color } from "../../style/color";

interface Props {
    label: string;
    content: string;
}

const LabelWithHelp: React.FC<Props> = ({label, content}) => {

    console.log(content)

    return (
        <Wrapper>
            <Label>{label}</Label>
            <HelpIcon />
        </Wrapper>
    )
}

export default LabelWithHelp;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    `

const Label = styled.div`
    font-weight: 700;
`

const HelpIcon = styled(IoIosHelp)`
    color: ${color.white};
    background-color: #274654;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
`