import React from "react";

import "./scss/components/modal.scss";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(e) {
        e.stopPropagation();
        this.props.closeModal();
        this.setState({ formSuccess: false })
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <div
                className="Modal"
                onClick={this.closeModal}
                style={{ display: (this.props.displayModal) ? "block" : "none" }} >
                <div
                    className="modal-content"
                    onClick={e => e.stopPropagation()} >
                    <span
                        className="close"
                        onClick={this.closeModal}>&times;
                 </span>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;
