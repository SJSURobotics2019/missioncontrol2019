import React, { Component } from "react";
import "./DriveStyle.css";
import joystick from "./joystick_new.js";
import {
  DM_DRIVE,
  BW_A,
  DRIVE_MODES,
  BACK_WHEELS
} from "./model.js";
import { 
  Alert,
  Badge,
  Button, 
  ButtonGroup,
  Col,
  Container,
  // Input,
  // InputGroup,
  // InputGroupAddon,
  Row
} from "reactstrap";

class DriveModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joystick_connected: false, 
      esp_connected: false,
      drive_mode: DM_DRIVE,
      back_wheel: BW_A,
      esp_ip: "192.168.10.51",
      
      t_max: 20,
      speed: 0,
      heading: 0
    };

    this.onJoystickConnect = this.onJoystickConnect.bind(this);
    this.onJoystickDisconnect = this.onJoystickDisconnect.bind(this);
    this.getDriveState = this.getDriveState.bind(this);
    this.updateDriveMode = this.updateDriveMode.bind(this);
    this.driveModeClicked = this.driveModeClicked.bind(this);
    this.updateBackWheel = this.updateBackWheel.bind(this);
    this.backWheelClicked = this.backWheelClicked.bind(this);
    this.updateThrottleMax = this.updateThrottleMax.bind(this);
    this.updateSpeed = this.updateSpeed.bind(this);
    this.updateHeading = this.updateHeading.bind(this);
    this.updateESPIP = this.updateESPIP.bind(this);
    this.renderBackWheelOptions = this.renderBackWheelOptions.bind(this);

    joystick.initDrive(this.getDriveState, this.updateDriveMode, this.updateBackWheel, this.updateSpeed, this.updateHeading, this.updateThrottleMax);
  }

  componentWillMount() {
    window.addEventListener("gamepadconnected", this.onJoystickConnect);
    window.addEventListener("gamepaddisconnected", this.onJoystickDisconnect);
  }

  getDriveState() {
    return this.state;
  }

  onJoystickConnect() {
    let gamepad_list = navigator.getGamepads();

		if (gamepad_list[0] !== null && gamepad_list[0].id.indexOf("Flight") !== -1) {
			this.setState({
        joystick_connected: true
      });
		} else if  (gamepad_list[1] !== null && gamepad_list[1].id.indexOf("Flight") !== -1) {
			this.setState({
        joystick_connected: true
      });
		}

  }

  onJoystickDisconnect() {
    let gamepad_list = navigator.getGamepads();
    let prev_drive_mode = this.state.drive_mode;
    
    this.setState({ 
      joystickConnected: false,
      drive_mode: null
    });

    if (gamepad_list[0] !== null  && gamepad_list[0].id.indexOf("Flight") !== -1) {
      this.setState({ 
        joystickConnected: true,
        drive_mode: prev_drive_mode
      });
    } 
    
    if (gamepad_list[1] !== null && gamepad_list[1].id.indexOf("Flight") !== -1) {
      this.setState({ 
        joystickConnected: true,
        drive_mode: prev_drive_mode
      });
    }
  }

  updateDriveMode(newDriveMode) {
    this.setState({
      drive_mode: newDriveMode
    });
  }

  driveModeClicked(e) {
    this.updateDriveMode( parseInt(e.target.value) );
  }
  
  updateBackWheel(newBackWheel) {
    this.setState({
      back_wheel: newBackWheel
    });
  }

  updateThrottleMax(newThrottleMax) {
    this.setState({
      t_max: newThrottleMax
    });
  }

  backWheelClicked(e) {
    this.updateBackWheel( parseInt(e.target.value) );
  }

  updateSpeed(newSpeed) {
    this.setState({
      speed: newSpeed
    });
  }

  updateHeading(newHeading) {
    newHeading = (typeof newHeading === "undefined" ? 0 : newHeading);

    this.setState({
      heading: newHeading
    });
  }

  decideButtonColor(current_val, state_val) {
    if(state_val != null && state_val === current_val){
      return "primary";
    } else{
      return "secondary";
    }
  }

  renderDriveModes() {
    return (
      <ButtonGroup>
        {DRIVE_MODES.map((mode) => {
          return (
            <Button 
              key={mode.id}
              onClick={this.driveModeClicked} 
              id={mode.id} 
              value={mode.value} 
              color={this.decideButtonColor(mode.value, this.state.drive_mode)} 
            >
              {mode.name}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }

  renderBackWheelOptions() {
    return (
      <ButtonGroup>
        {BACK_WHEELS.map((wheel) => {
          return (
            <Button 
              onClick={this.backWheelClicked} 
              id={wheel.name} 
              value={wheel.value} 
              key={wheel.name}
              color={this.decideButtonColor(wheel.value, this.state.back_wheel)}
            >
              {wheel.name}
            </Button>
          );
        })}
      </ButtonGroup>
    );
    
  }

  renderJoystickStatus() {
    switch(this.state.joystick_connected) {
      case true:
        return <Alert color="success"> Joystick is connected! </Alert>;
      case false:
        return <Alert color="danger"> Joystick is disconnected! </Alert>;
      default:
        return <Alert color="primary">WHAT</Alert>;
    }
  }

  updateESPIP() {
    console.log("ESP IP cannot be set anymore due to final address being released");
    // this.setState({
    //   esp_ip: document.getElementById("esp_ip_input").value
    // });
  }

  render() {
    return (
      <Container>
        <Row>
            <h2>ESP IP {this.state.esp_ip}</h2>
        </Row>
        
        <Row>
          <Col>
            <Row>
              <h2>Mode</h2>
            </Row>
            <Row>
              { this.renderDriveModes() }
            </Row>
          </Col>
          
          <Col>
            <Row>
              <h2>Joystick Status</h2>
            </Row>
            <Row>
              { this.renderJoystickStatus() }
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <h2>Back Wheel</h2>
            </Row>
            <Row>
              { this.renderBackWheelOptions() }
            </Row>
          </Col>
          <Col>
            <Row>
              <h2>Speed</h2>
            </Row>
            <Row>
              <Badge color="secondary">{this.state.speed}</Badge>
            </Row>
          </Col>

          <Col>
            <Row>
              <h2>Heading</h2>
            </Row>
            <Row>
              <Badge color="secondary">{this.state.heading}°</Badge>
            </Row>
          </Col>

          <Col>
            <Row>
              <h2>Throttle Max</h2>
            </Row>
            <Row>
              <Badge color="secondary">{this.state.t_max}</Badge>
            </Row>
          </Col>
          
        </Row>
        
      </Container>
    );
  }
}

export default DriveModule;
