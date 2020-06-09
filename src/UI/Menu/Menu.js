import React from "react";
import { withRouter } from "react-router-dom";

import classes from "./Menu.module.css";
import Auxilary from "../../HOC/Auxilary/Auxilary";
import Backdrop from "../../UI/Backdrop/Backdrop";

class Menu extends React.Component {
    state = {
        isShown: false,
    };

    toggleHandler = () => {
        this.setState((currState) => ({ isShown: !currState.isShown }));
    };

    onClickHandler = (path) => {
        this.props.history.push(path);
    };

    render() {
        let menu = null;
        if (this.state.isShown) {
            menu = (
                <Auxilary>
                    <div className={classes.Options}>
                        <ul>
                            {this.props.options.map((option) => {
                                return (
                                    <li
                                        onClick={() => {
                                            this.onClickHandler(option.path);
                                            this.toggleHandler();
                                        }}
                                        key={option.label}
                                    >
                                        <img
                                            className={classes.OptionIcon}
                                            src={option.src}
                                            alt=""
                                        />
                                        <span className={classes.OptionLabel}>
                                            {option.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <Backdrop backdropHandler={this.toggleHandler} />
                </Auxilary>
            );
        }
        return (
            <Auxilary>
                <div className={classes.Menu} onClick={this.toggleHandler}>
                    <div className={classes.MenuIcon}>
                        <img src={this.props.menuIconSrc} alt="" />
                    </div>
                    <div className={classes.Title}>{this.props.title}</div>
                    <div className={classes.DownArrow}></div>
                </div>
                {menu}
            </Auxilary>
        );
    }
}

export default withRouter(Menu);
