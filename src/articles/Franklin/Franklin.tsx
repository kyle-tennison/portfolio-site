import GenericArticle from "../../pages/GenericArticle";

import franklinTransparentImage from "./franklin-transparent.png";
import franklinBodySegments from "./franklin-body-segments.png";
import franklinBodyFabricated from "./franklin-body-fabricated.jpeg";
import franklinWireframe from "./franklin-wireframe.png";
import communicationDrawing from "./communication-drawing.svg";
import espControlFlow from "./esp-control-flow.svg";
import pidCode from "./pid-code.png";
import prototypeBoardTimelapse from "./prototype-board-timelapse.mp4";
import finalFranklinBoard from "./final-franklin-board.jpg";
import prototypePcb from "./prototype-pcb.jpeg";
import finalPcb from "./final-pcb.png";
import untrainedFranklin from "./untrained-franklin.mp4";
import franklinTrialSample from "./franklin-trial-sample.mp4";
import kickTrial from "./kick-trial.mp4";

export default function FranklinArticle() {
  return (
    <>
      <GenericArticle
        title="Franklin"
        date="February 2024"
        description="All about Franklin: my 3D printed self-balancing robot"
        readTime="0 minutes"
        titleImage="https://polybrain.b-cdn.net/contribute-art.png"
      >
        <h1>Background</h1>
        <img src={franklinWireframe} alt="Franklin CAD Wireframe" />
        <em className="centered">
          &emsp;Franklin's CAD is in Onshape and can be{" "}
          <a href="https://cad.onshape.com/documents/53467c6e83de194546f290fb">
            viewed here.
          </a>
        </em>
        <br />
        &emsp;Franklin is a 3D printed, self-balancing robot that I created
        during my first year as an undergraduate at{" "}
        <a href="https://canadacollege.edu/">Cañada College</a>. While I
        previously had some experience with microcontrollers, CAD, and control
        systems, I had never embarked on a solo project where I had to handle
        every aspect on my own. In the past, I'd always been part of a team,
        with others focusing on different areas of design or fabrication.
        Franklin was a personal test to see if I could successfully create a
        dexterous system from the ground up by myself.
        <br />
        <br />
        &emsp;Franklin may seem like a strange name for a robot—but it's part of
        an inside joke among my friends. Around the time I built Franklin, we
        had a running gag of picking oddly human names for objects and animals.
        The joke started after we saw{" "}
        <a href="https://x.com/decentbirthday/status/1145747743723290624?lang=en">
          a tweet
        </a>{" "}
        about a dog named Kevin, so Franklin felt like an apt choice for my
        little robot.
        <h1>Engineering Overview</h1>
        <h2>Mechanical Design</h2>
        &emsp;Franklin has two independently driven 3D-printed wheels. Each
        wheel is powered by a {String.raw`\(59 N \cdot \text{cm}\)`}{" "}
        <a href="https://www.amazon.com/dp/B00PNEQKC0?ref=ppx_yo2ov_dt_b_fed_asin_title">
          NEMA 17 stepper motor
        </a>
        . Each motor is fitted with a 12-tooth 3mm GT2 pulley, which is
        connected via a belt to a 48-tooth pulley pressed onto a{" "}
        {String.raw`\(1/2\,\text{in}\)`} aluminum hex shaft. This hex shaft is
        supported by two ball bearings that are press-fit into Franklin's outer
        wall and its inner rib. The shaft extends{" "}
        {String.raw`\(1 \frac{5}{8}\text{ in}\)`} beyond the outer wall,
        allowing the 3D-printed tri-spoke wheel to be pressed onto it. Finally,
        3D-printed shaft collars hold the shaft and pulley in place. The image
        below shows the drivetrain system with the support walls made
        transparent.
        <img
          src={franklinTransparentImage}
          alt="Franklin drivetrain transparent"
        />
        <p className="centered">A transparent view of Franklin's drivetrain.</p>
        <br />
        <br />
        &emsp;My personal 3D printer—which was the only tool readily available
        for this project—is a{" "}
        <a href="https://www.creality.com/products/ender-3-pro-3d-printer">
          Creality Ender 3 Pro
        </a>{" "}
        (which I would highly recommend for anyone looking for their first 3D
        printer). The maximum print volume for this printer is{" "}
        {String.raw`\(220 \text{mm}\times 220 \text{mm}\times 250\text{mm}\)`},
        which was smaller than the volume of Franklin's inner body. To address
        this limitation, Franklin's inner body (i.e., everything except the
        wheels) was split into segments that were small enough to fit on the
        print bed.
        <img src={franklinBodySegments} alt="Franklin body segments" />
        <p className="centered">
          Exploded view of the segments that compose Franklin's body.
        </p>
        <br />
        <img
          src={franklinBodyFabricated}
          alt="Early photo of Franklin's fabrication with printed segments"
        />
        <p className="centered">
          Early photo of Franklin's fabrication with printed segments.
        </p>
        <br />
        <br />
        &emsp;The rest of the assembly is relatively simple: there are two slots
        for {String.raw`\(5200\,\text{mAh}\)`} 3S LiPo batteries, a mount for
        the stepper motors, and some room for the electronics.
        <h2>Control System</h2>
        &emsp;The computer onboard Franklin is an{" "}
        <a href="https://www.espressif.com/en/products/socs/esp32">ESP32</a>—a
        popular board among hobbyists, similar to Arduino but much more capable.
        I chose the ESP32 primarily for its multitasking support. Built on{" "}
        <a href="https://en.wikipedia.org/wiki/FreeRTOS">FreeRTOS</a>, it
        enables concurrent task execution; this allows for code structures
        resembling multi-threading, which greatly simplified development.
        <br />
        <br />
        &emsp;The primary input to Franklin's computer was an MPU6050 Inertial
        Measurement Unit (IMU), which contains both a gyroscope and an
        accelerometer. The sole purpose of this IMU was to determine Franklin's
        tilt; knowing this information was essential for correcting that tilt.
        When using an accelerometer to estimate the lean angle, the basic idea
        is to determine the direction of gravity. To do this, the lean angle
        (\(\theta_y\)) is calculated using{" "}
        {String.raw`\(\theta_y = \text{atan}(a_x / a_z)\)`}, where \(a_x\) and
        \(a_z\) are the \(X\) and \(Z\) acceleration components. This method
        provides an accurate but noisy estimate of tilt based solely on gravity.
        To compensate for this noise, the system also reads the angular velocity
        (\(\omega_y\)) from the gyroscope and computes the angular acceleration
        as{" "}
        {String.raw`\(\alpha_y = \frac{\omega_y - \omega_{y,\text{prev}}}{\Delta t}\)`}
        . It then predicts the angle (\(\theta_y\)) with{" "}
        {String.raw`\(\theta_{y,\text{pred}} = \theta_{y,\text{prev}} + \omega_y \Delta t + \frac{1}{2} \alpha_y (\Delta t)^2\)`}
        . At this point, there is a noisy angle reading from the accelerometer
        and a smooth angle found by "integrating" the gyroscope measurement. The
        accelerometer angle is noisy, but otherwise accurate; the gyroscope
        measurement is precise and less noisy, but integration errors cause it
        to slowly drift from the true angle over time. Ideally, one would use a{" "}
        <a href="https://en.wikipedia.org/wiki/Kalman_filter">Kalman filter</a>{" "}
        to combine these signals, but for this project, I used a more
        rudimentary mixing approach that worked well enough.
        <br />
        <br />
        &emsp;Franklin's ESP32 ran three tasks: a socket server, a telemetry
        loop, and a stepper loop. The image below gives an overview of how each
        task communicates with the others.
        <img src={espControlFlow} alt="ESP32 control flow" />
        <p className="centered">
          A diagram showing the concurrent tasks on Franklin's ESP32.
        </p>
        <h3>Stepper Loop</h3>
        &emsp;The simplest of the three tasks is the stepper loop. Franklin's
        NEMA 17 steppers are driven using{" "}
        <a href="https://www.amazon.com/dp/B01NCE3ZW1?ref=ppx_yo2ov_dt_b_fed_asin_title">
          DRV8825 Stepper Motor Drivers
        </a>
        . These modules are straightforward: the motor pins and power source
        connect directly to the PCB, and sending a pulse to the STEP pin causes
        the stepper to move one step. By toggling the DIR pin between HIGH and
        LOW, we can control the direction of the stepper's motion—as long as we
        know how long to wait between pulses. This pulse delay is calculated by
        the <em>Telemetry Loop</em>, which implements a{" "}
        <a href="https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller">
          PID loop
        </a>{" "}
        to determine the desired angular velocity. The Telemetry Loop streams
        the desired angular velocity through a thread-safe queue to the Stepper
        Loop, which then converts the angular velocity into a pulse profile
        compatible with the stepper driver.
        <h3>Telemetry Loop</h3>
        &emsp;As mentioned, the Telemetry Loop is responsible for running the
        PID calculations. For those unfamiliar, PID stands for
        Proportional-Integral-Derivative; by tuning the constants \(c_P, c_I,
        c_D\), we define a control function \(u(t)\) from an input
        \(f(t)\)—which in this case is the angle of the robot (found with
        accelerometer by seeing which way gravity points*). The relationship is:
        {String.raw`\[u(t)=c_P f(t)+ c_I \int \limits _0^t f(\tau)\,d\tau + c_D\,\frac{df(t)}{dt}\]`}
        While this may look complicated, we're really just taking a weighted sum
        of the value of the function, its integral, and its derivative. In
        Franklin's context, we're looking for some {String.raw`\(u(t_{i+1})\)`}{" "}
        (i.e., the next angular velocity of the wheels) given \(f(t_i)\) (i.e.,
        the value read from the accelerometer). Since we know \(f(t_j)\) for \(j
        = 0, 1, \dots, i\), we can also approximate the following:
        {String.raw`\[\int \limits _0^{t_i} f(\tau)\,d\tau \approx \sum _{j=0}^i f(t_j)(t_j-t_{j-1})\]`}
        and
        {String.raw`\[\frac{df(t)}{dt} \approx \frac{f(t_i)-f(t_{i-1})}{t_i-t_{i-1}} \]`}
        This likely seems more complicated than it really is. Below is the
        function that actually implements the PID loop:
        <img src={pidCode} alt="Example PID code" />
        The <em className="code">integral</em> variable starts at zero at the
        beginning of the program and gets incremented or decremented to
        approximate the integral. The variable{" "}
        <em className="code">previous</em>, representing{" "}
        {String.raw`\(f(t_{i-1})\)`}, helps approximate the derivative via
        finite difference.
        <br />
        <br />
        &emsp;The aforementioned constants \(c_P, c_I, c_D\) can be changed at
        runtime via a request to the <em>Socket Server</em>. To facilitate this,
        another queue streams data from the Socket Server to the Telemetry Loop.
        As for actual telemetry—which includes the accelerometer value
        \(f(t_i)\), the approximated integral{" "}
        {String.raw`\(\int_0^{t_i} f(\tau)\,d\tau \)`}, and the motor target{" "}
        {String.raw`\(u(t_{i+1})\)`}—these are streamed <em>to</em> the Socket
        Server via another queue.
        <h3>Socket Server</h3>
        &emsp;The final part of the system is the Socket Server running on the
        ESP32. The ESP32 hosts a{" "}
        <a href="https://en.wikipedia.org/wiki/SoftAP">SoftAP</a> WiFi network
        that a client device (my laptop) can connect to. The client runs a
        Rust-based CLI app that allows runtime adjustment of the PID constants
        (\(c_P, c_I, c_D\)) along with other motion settings. At the same time,
        the ESP32 streams telemetry back to the client program, which aids in
        PID tuning.
        <img
          src={communicationDrawing}
          alt="ESP32-to-client communication diagram"
        />
        <p className="centered">
          A diagram showing the communication between the ESP and client
        </p>
        <h2>Electronics</h2>
        &emsp;The first revision of Franklin's hardware was prototyped on
        perfboard; the video below shows a time-lapse of me hand-crafting it.
        <video autoPlay loop muted>
          <source src={prototypeBoardTimelapse} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="centered">
          A time-lapse of me soldering the first prototype of Franklin's
          hardware.
        </p>
        <br />
        <br />
        <img src={finalFranklinBoard} alt="The finished prototype board" />
        <p className="centered">The finished prototype board.</p>
        <br />
        &emsp;While the prototype board was able to perform all of Franklin's
        basic functions, I wanted to create a PCB instead of relying on
        perfboard. I had never used an ESP32 on a PCB before, so I first
        designed a prototype PCB to drive a single stepper motor.
        <img src={prototypePcb} alt="Single-stepper prototype ESP32 board" />
        <p className="centered">A single-stepper prototype ESP32 board.</p>
        <br />
        &emsp;After getting comfortable with ESP32 development, I created a
        dual-stepper PCB with everything needed to run Franklin. Unfortunately,
        this project remains unfinished for now; my acceptance to Georgia Tech
        required me to move to Atlanta within two months of getting the news.
        I'll update this article if I ever complete the PCB assembly.
        <img src={finalPcb} alt="Final Franklin PCB render" />
        <p className="centered">3D render of the final Franklin PCB.</p>
        <h1>Training</h1>
        &emsp;Now came the hardest part of the project: tuning the PID
        controller. This entailed adjusting the aforementioned constants (\(c_P,
        c_I, c_D\)) by hand until Franklin could keep itself upright.
        <video controls>
          <source src={untrainedFranklin} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="centered">
          A video of Franklin with arbitrary PID parameters.
        </p>
        <br />
        &emsp;Really, this was more of an art than a science. Over a few days, I
        spent time on the ground with Franklin, tuning the PID parameters from
        my computer until he was finally able to balance on his own. I wrote a
        Python script to display some Matplotlib plots of the incoming telemetry
        data to see how the PID was reacting. In the video below, this allowed
        me to discover that I had a broken integral approximation.
        <video controls autoPlay muted>
          <source src={franklinTrialSample} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="centered">Training video with telemetry overlay</p>
        <br />
        &emsp;Finally, after many hours of fine-tuning, Franklin was balancing
        on his own and could even stay upright after a few (gentle) kicks:
        <video controls>
          <source src={kickTrial} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1>Remarks</h1>
        &emsp;Franklin is far from perfect; the DRV8825 drivers were running
        over their rated limits, the center of mass could have been better
        designed for stability, and my attempts to add remote-control driving
        and turning never came to fruition. However, this was a playful, fun
        project that let me explore new fields I'll likely revisit later in
        life.
        <br />
        <br />
        &emsp;All of Franklin's Onshape CAD can be{" "}
        <em>
          <a href="https://cad.onshape.com/documents/53467c6e83de194546f290fb">
            viewed here
          </a>
        </em>
        . The KiCAD models for the PCB are in the{" "}
        <a
          href="https://github.com/kyle-tennison/franklin_pcb"
          className="code"
        >
          franklin_pcb
        </a>{" "}
        repo on my GitHub, and the rest of the C++, Rust, and Python code is in
        the{" "}
        <a href="https://github.com/kyle-tennison/franklin" className="code">
          franklin
        </a>{" "}
        repo. If you have any questions about this project, don't hesitate to{" "}
        <a href="/articles/contact">contact me</a>.
      </GenericArticle>
    </>
  );
}
