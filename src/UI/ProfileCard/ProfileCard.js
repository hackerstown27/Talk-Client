import React from "react";

import classes from "./ProfileCard.module.css";
import Button from "../Button/Button";
import Modal from "../../UI/Modal/Modal";
import { capitalize, toPhoneFormat, toDateFormat } from "../../utility";
import Input from "../Input/Input";

class ProfileCard extends React.Component {
    state = {
        showDeleteModal: false,
        isEditing: false,
        onAvatarHover: false,
        previewImg: null,
    };

    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };

    onToggleEditProfile = () => {
        this.setState((prevState) => {
            return { isEditing: !prevState.isEditing };
        });
    };

    onAvatarMouseOver = () => {
        this.setState({ onAvatarHover: true });
    };

    onAvatarMouseOut = () => {
        this.setState({ onAvatarHover: false });
    };

    render() {
        const profileData = this.props.profileData;
        let statusDetails = null;
        switch (profileData.status) {
            case "online":
                statusDetails = {
                    label: " Online",
                    statusClass: classes.Online,
                };
                break;
            case "away":
                statusDetails = {
                    label: " Away",
                    statusClass: classes.Away,
                };
                break;
            default:
                statusDetails = {
                    label: " Offline",
                    statusClass: classes.Offline,
                };
        }

        let modal = null;
        if (this.state.showDeleteModal) {
            modal = (
                <Modal
                    title="Sure ?"
                    onClose={this.closeDeleteModal}
                    onDismiss={this.closeDeleteModal}
                    onProceed={this.props.onDeleteHandler}
                >
                    Are You Sure You Want To Delete Your Account ?
                </Modal>
            );
        }

        let profilePic = (
            <div className={classes.Avatar}>
                <img
                    className={classes.AvatarImg}
                    src={`http://localhost:5000/api/users/uploads/${profileData.profilePic.filename}`}
                    alt=""
                />
            </div>
        );

        let status = (
            <div>
                <h2>Status</h2>
                <h3>
                    <span className={statusDetails.statusClass}></span>
                    {statusDetails.label}
                </h3>
            </div>
        );

        if (this.state.isEditing) {
            const statusField = this.props.inputFields.status;
            const profilePicFile = this.props.inputFields.file;
            const file = this.props.inputFields.file;

            profilePic = (
                <div
                    className={classes.Avatar}
                    onMouseEnter={this.onAvatarMouseOver}
                    onMouseLeave={this.onAvatarMouseOut}
                >
                    <img
                        className={classes.AvatarImg}
                        src={
                            profilePicFile.file
                                ? URL.createObjectURL(profilePicFile.file)
                                : `http://localhost:5000/api/users/uploads/${profileData.profilePic.filename}`
                        }
                        alt=""
                    />
                    {this.state.onAvatarHover ? (
                        <span className={classes.AvatarEdit}>
                            <div>
                                <Input
                                    label={file.label}
                                    config={file.config}
                                    value={file.value}
                                    acceptedTypes={
                                        file.validationRules.mimeTypes
                                    }
                                    onChangeHandler={(event) => {
                                        this.props.onChangeHandler(
                                            event,
                                            "file"
                                        );
                                    }}
                                />
                            </div>
                        </span>
                    ) : null}
                </div>
            );

            status = (
                <div>
                    <h2>Status</h2>
                    <h3>
                        <Input
                            config={statusField.config}
                            value={statusField.value}
                            isValid={statusField.isValid}
                            isTouched={statusField.isTouched}
                            onChangeHandler={(event) => {
                                this.props.onChangeHandler(event, "status");
                            }}
                        />
                    </h3>
                </div>
            );
        }

        return (
            <div className={classes.Profile}>
                {modal}
                <div className={classes.Btn}>
                    <Button
                        type="primary"
                        onClickHandler={() => {
                            this.onToggleEditProfile();
                            if (this.state.isEditing) {
                                this.props.onEditHandler();
                            }
                        }}
                    >
                        {this.state.isEditing ? "Save Profile" : "Edit Profile"}
                    </Button>

                    <Button
                        type="secondary"
                        onClickHandler={this.showDeleteModal}
                    >
                        Delete Account
                    </Button>
                </div>
                {profilePic}
                <div className={classes.PersonelInfo}>
                    <h1>{capitalize(profileData.name)}</h1>
                    <h2>{toPhoneFormat(profileData.phoneNo)}</h2>
                    <h2>{profileData.gender.toUpperCase()}</h2>
                </div>

                <div className={classes.Info}>
                    <div>
                        <h2>Birthday</h2>
                        <h3>{toDateFormat(profileData.dob)}</h3>
                    </div>
                    <div>
                        <h2>Friends</h2>
                        <h3>{profileData.friends.length}</h3>
                    </div>
                    {status}
                </div>
            </div>
        );
    }
}

export default ProfileCard;
