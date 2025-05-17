import GenericArticle from "../../pages/GenericArticle";

import franlinTransparentImage from "./franklin-transparent.png"
import franklinBodySegments from "./franklin-body-segments.png"
import franklinBodyFabricated from "./franklin-body-fabricated.jpeg"
import franklinWireframe from "./franklin-wireframe.png"
import communicationDrawing from"./communication-drawing.svg"
import espControlFlow from "./esp-control-flow.svg"
import pidCode from "./pid-code.png"
import prototypeBoardTimelapse from "./prototype-board-timelapse.mp4"
import finalFranklinBoard from "./final-franklin-board.jpg"
import prototypePcb from "./prototype-pcb.jpeg"
import finalPcb from "./final-pcb.png"
import untrainedFranklin from "./untrained-franklin.mp4"
import franklinTrialSample from "./franklin-trial-sample.mp4"
import kickTrial from "./kick-trial.mp4"

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
      <img src={franklinWireframe}/>

      <em className="centered">&emsp;Franklin's CAD is in Onshape and can be <a href="https://cad.onshape.com/documents/53467c6e83de194546f290fb">viewed here.</a></em>

      <br/>

      &emsp;Franklin is a 3D printed, self balancing robot that I created during my first year in 
      my undergraduate studies at <a href="https://canadacollege.edu/">Cañada College</a>. 
      I had previously had some experience with microcontrollers, CAD, and control systems,
      but I'd never embarked on a solo-project where I'd have to tackle everything at once;
      in the past, I had always been on a team with other people who were focusing on some
      other aspet of the design or fabrication. Franklin was a test for myself to see if I
      would be able to secessfully create a dexterious system from zero by myself. 

      <br/><br/>

      &emsp;Franklin probably seems like a strange name for a robot—I agree. Around the time 
      that I made Franklin, there was a running joke with my friends where we'd pick names 
      for objects & animals that seemed strangely human. The joke started after we 
      saw <a href="https://x.com/decentbirthday/status/1145747743723290624?lang=en">a tweet</a> about 
      a dog named Kevin; so Franklin was an apt pick for my little robot.

      <h1>Engineering Overview</h1>

      <h2>Mechanical Design</h2>

      &emsp;Franklin has two independently-driven 3D printed wheels. Each wheel 
      is driven by a {String.raw`\(59 N \cdot \text{ cm} \)`} <a href="https://www.amazon.com/dp/B00PNEQKC0?ref=ppx_yo2ov_dt_b_fed_asin_title">NEMA 17 stepper motor</a>, 
      each of which is fitted with a 12-tooth 3mm GT2 pulley; a belt connects this pulley 
      to a 48-tooth pulley that's pressed onto an {String.raw`\(1/2 \;in\)`} aluminum hex shaft.
      This hex shaft is reacted by two ball-bearings that are press fit into 
      Franklin's outer wall and it's inner rib; the shaft extrudes {String.raw`\(1 \frac{5}{8} in\)`} beyond
      the outer wall, which allows the 3D-printed tri-spoke wheel to be pressed onto the 
      shaft. Finally, 3D-printed shaft collars hold the shaft and the pulley in place.
      The image below shows the drivetrain system with the support walls made transparent.
      

      <img src={franlinTransparentImage}/>
      <p className="centered">A transparent view of Franklin's drivetrain.</p>

      <br/><br/>

      &emsp;My personal 3D printer—which was the only tool that was readily available to me
      for this project—is a <a href="https://www.creality.com/products/ender-3-pro-3d-printer">Creality Ender 3 Pro</a> (which 
      I would highly reccomdend for anyone looking for their first 3D printer). The maximum
      print volume for this printer is {String.raw`\(220 \text{mm}\times 220 \text{mm}\times 250\text{mm}\)`},
      which was smaller than the volume of Franklin's inner body. To address this issue, 
      Franklin's inner body (i.e., everything but the wheels) was split into stages 
      that were small enough to fit on the print bed.

      <img src={franklinBodySegments}/>
      <p className="centered">Exploded view of the segments that compose Franklin's body.</p>

      <br />

      <img src={franklinBodyFabricated}/>
      <p className="centered">Early photo of Franklin's fabrication with printed segments.</p>
      
      <br/><br/>

      &emsp;The rest of the assembly is pretty simple; there are two slots 
      for {String.raw`\(5200 \text{ mAh}\)`} 3s lipo batteries, a mount for the
      stepper motors, and some room for the electronics.

      <h2>Control System</h2> 

      &emsp;The computer onboard Franklin is an <a href="https://www.espressif.com/en/products/socs/esp32">ESP32</a>—a
      popular board among hobbyists, similar to Arduino but with significantly more capability.
      I chose the ESP32 primarily for its multitasking support; built on
      <a href="https://en.wikipedia.org/wiki/FreeRTOS">FreeRTOS</a>, it enables concurrent task execution.
      This allows for code structures resembling multi-threading, which greatly simplified development.

      <br/><br/>

      &emsp;Franklin's ESP32 ran three tasks: a socket server, a telemetry loop,
      and a stepper loop. The image below gives an overview of how each task 
      communicates with each other.

      <img src={espControlFlow}/>
      <p className="centered">An image showing the concurrent tasks on Franklin's ESP32.</p>



      <h3>Stepper Loop</h3>

      &emsp;The simplest of the three tasks shown above is the stepper loop. Franklin's 
      NEMA 17 steppers are driven using <a href="https://www.amazon.com/dp/B01NCE3ZW1?ref=ppx_yo2ov_dt_b_fed_asin_title">DRV8825 Stepper Motor Drivers</a>.
      These modules are very simple: the motor pins connect directly to the PCB along with 
      their power source, then, by sending a pulse to the STEP pin, the stepper with take one 
      step. Then, by flipping the DIR pin between HIGH and LOW, we can easily control 
      the stepper motion, so long as we know how long to wait between pulses. This 
      pulse delay is calculated by the <em>Telemetry Loop</em>, which runs through 
      a <a href="https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller">PID Loop</a> to
      find the desired angular velocity. The Telemetry Loop streams the desired angular velocity 
      through a thread-safe queue to the Stepper Loop, which will then convert the angular 
      velocity into a pulse-profile compatible with the stepper driver.

      <h3>Telemetry Loop</h3>

      &emsp;As mentioned, the Telemetry Loop is responsible for running through 
      the PID calcualations. For those who are not familiar, PID stands for 
      Proportonal-Integral-Derivative; by tuning the constants \(c_P, c_I, c_D\), 
      we can define some control function \(u(t)\) from an input \(f(t)\)—which, 
      in this case, is the angle of the robot (from the accelerometer). The relationship is:

      {String.raw`\[u(t)=c_P f(t)+ c_I \int \limits _0^t f(\tau) d\tau + c_D\; \frac{df(t)}{dt}\]`}

      While this may look complicated, we're really just taking a weighted sum of: the 
      value of the function, the integral of the function, and the derivative of the function.
      In the context of Franklin, we are looking for some {String.raw`\(u(t_{i+1})\)`} (i.e. the 
      next angular velocity of the wheels) given \(f(t_i)\) (i.e. the value read from the accelerometer).
      Because we know \(f(t_j) \in j= 0, 1, \dots, i\), we can also approximate the following:

      {String.raw`\[\int \limits _0^{t_i} f(\tau) d\tau \approx \sum _{j=0}^i f(t_j)(t_j-t_{j-1}) \qquad \text{and} \qquad \frac{df(t)}{dt} \approx \frac{f(t_i)-f(t_{i-1})}{t_i-t_{i-1}} \]`}

      This likely seems more complicated than it really is. Below is the function that 
      actually implements the PID loop.      

      <img src={pidCode}/>

      The <em className="code">integral</em> variable starts at zero at the beginning
      of the program and is added/subtracted from to approximate the integral. 
      Then, we store <em className="code">previous</em>, which mathematically
      is {String.raw`\(f(t_{i-1})\)`}; this allows us to approximate the derivative
      via finite-difference. 

      <br/><br/>

      &emsp;The aforementioned constants \(c_P, c_I, c_D\) can be changed at runtime
      by a request to the <em>Socket Server</em>. To facilitate this, another queue 
      is used to stream data from the Socket Server to the Telemetery Loop. As for
      actual telemetry—which includes the gyroscope value \(f(t_i)\), the approximated 
      integral {String.raw`\(\int_0^{t_i} f(\tau) d\tau \)`}, and the motor 
      target {String.raw`\(u(t_{i+1})\)`}—these are streamed <em>to</em> the 
      Socket server via another queue.

      <h3>Socket Server</h3>

      &emsp;The final part of picture is the Socket server that runs on the ESP32.
      The ESP32 hosts a <a href="https://en.wikipedia.org/wiki/SoftAP">SoftAP</a> wifi 
      network that a client device (my laptop) can connect to. The client runs a 
      Rust-based CLI app that allows runtime adjustment of the PID constants \(c_P, c_I, c_D\) allong 
      with some other motion settings. At the same time, the ESP32 streams telemetry back
      to the client program, which can aid in PID tuning.

      <img src={communicationDrawing}/>
      <p className="centered">A diagram showing the communication between the ESP and client</p>

      <h2>Electronics</h2>

      &emsp;The first revision of Franklin's hardware was prototyped on some
      perfboard; the video below shows a time lapse of hand-crafting it.

      <video autoPlay loop muted>
        <source src={prototypeBoardTimelapse} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>

      <p className="centered">A time-lapse of me soldering the first prototype of Franklin's hardware.</p>

      <br/><br/>

      <img src={finalFranklinBoard}/>
      <p className="centered">The finished prototype board.</p><br/>

      &emsp;While the prototype board was able to perform all of Franklin's necessary
      functions, I wanted to create a PCB instead of perfboard. I had never used 
      an ESP32 on PCB before, so I first created a prototype PCB to drive a single 
      stepper motor.

      <img src={prototypePcb}></img>
      <p className="centered">A single-stepper prototype ESP32 board.</p><br/>

      &emsp;After getting comfortable with ESP32 development, I created a dual-stepper 
      PCB with everything needed to run Franklin. Unfortunately, this remains a 
      project to pick up at a future date; my acceptance to Georgia Tech made me 
      drop everything and move to Atlanta within 2 months of hearing back. I'll 
      update this article if I ever complete the PCB assembly.

      <img src={finalPcb}/>
      <p className="centered">3D render of the final Franklin PCB.</p>

      <h1>Training</h1>

      &emsp;Now came the hardest part of the project: tuning the PID control. This entailed, 
      tuning the aforementioend constants \(c_P, c_I, c_D\) by hand until Franklin was 
      able to keep itself upright.

      <video controls>
        <source src={untrainedFranklin} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
      <p className="centered">A video of Franklin with arbitrary PID parameters.</p><br/>

      &emsp;Really, this was more of an art than a science. Over a few days,
      I spent time on the ground with Franklin, tuning the PID parameters from my
      computer until he was finally able to balance on his own. I wrote a Python 
      script to display some Matplotlib plots of the incoming telemetry to help 
      see how the PID was reacting. In the video below, this allowed me to discover
      that I had a broken integral approximation.

      <video controls autoPlay muted>
        <source src={franklinTrialSample} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
      <p className="centered">Training video with telemetry overlay</p><br/>

      &emsp;Finally, after many hours of fine tuning, Franklin was balancing on
      his own and was even able to stand up to a few (easy) kicks:

      <video controls>
        <source src={kickTrial} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>


        <h1>Remarks</h1>

        &emsp;Franklin is far from perfect; the DRV8825 drivers were running over their rating, 
        the COM could have been adjusted to be a bit more advantageous for balance, 
        and my endeavours of having a remote-control driving and turning system 
        never saw fruition. However, this was a playful, fun project that let me explore 
        some new fields that I'll probably re-encounter later in life.

        <br/><br/>
        &emsp;All of Franklin's Onshape CAD can be <em><a href="https://cad.onshape.com/documents/53467c6e83de194546f290fb">viewed here</a></em>. 
        The KiCAD models for the PCB are in 
        the <a href="https://github.com/kyle-tennison/franklin_pcb" className="code">franklin_pcb</a> repo 
        on my GitHub, and the rest of the C++, Rust, and Python code is in 
        the <a href="https://github.com/kyle-tennison/franklin" className="code">franklin</a> repo.
        If you have any questions about this project, don't hesitate to <a href="/articles/contact">contact me</a>.

        



      </GenericArticle>
    </>
  );
}
