import { OverlayTrigger, Button, Popover } from "react-bootstrap";

export const createPopover = (message) => (
    <Popover id="popover-basic">
        <Popover.Body>
            {message}
        </Popover.Body>
    </Popover>
);

export const PopoverButton = ({message}) => (
    <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={createPopover(message)}
    >
        <Button
            variant="link"
            className="popover-btn"
        >
            ?
        </Button>
    </OverlayTrigger>
)