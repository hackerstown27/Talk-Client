import React from "react";
import classes from "./Modal.module.css";
import Button from "../Button/Button";

class Modal extends React.Component {
    state = {
        modalClass: [classes.Modal, classes.ModalOpen],
    };

    modalClosed = () => {
        this.setState({modalClass: [classes.Modal, classes.ModalClosed]})
        setTimeout(() => {
            this.props.onClose()
        }, 300)
    }

    render() {
        return (
            <div className={this.state.modalClass.join(" ")}>
                <div className={classes.Header}>
                    <div className={classes.Title}>{this.props.title}</div>
                    <div className={classes.Close} onClick={this.modalClosed}>
                        X
                    </div>
                </div>
                <div className={classes.Content}>{this.props.children}</div>
                <div className={classes.Footer}>
                    <Button
                        type="secondary"
                        onClickHandler={this.modalClosed}
                    >
                        Dismiss
                    </Button>
                    <Button
                        type="primary"
                        onClickHandler={this.props.onProceed}
                        disabled={this.props.disableProceed}
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        );
    }
}

export default Modal;
