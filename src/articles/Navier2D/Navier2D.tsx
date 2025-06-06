import { Link, Element } from "react-scroll";

import materialElementPhoto from "./material-element.png";
import materialElementDxPhoto from "./material-element-dx.png";
import simAnimation from "./sim-animation.gif";
import carSim from "./car-sim.gif";
import gridDiagram from "./grid-diagram.png";
import rippleAirfoil from "./ripple-airfoil.png";

import GenericArticle from "../../pages/GenericArticle";
import SyntaxHighlighter from "react-syntax-highlighter";
import { srcery } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Navier2DArticle() {
  return (
    <GenericArticle
      title="Navier-2D"
      description="Introductory explanation of solving the Navier-Stokes equation in 2D for an incompressible Newtonian fluid using finite differences."
      date="May 2025"
      readTime="15 minutes"
      titleImage="https://kyletennison.b-cdn.net/wind-tunnel-background.webp"
    >
      <h1>Overview</h1>
      The <strong>Navier-Stokes equations</strong> are a set of
      nonlinear partial differential equations that govern the motion of viscous
      fluids. In their compressible form, they are written as:

      <div className="long-horiz">
        {String.raw`
            \[
            \rho\left(\frac{\partial \mathbf{u}}{\partial t} + \mathbf{u} \cdot \nabla \mathbf{u} \right)
            = -\nabla p + \nabla \cdot \left[ \mu \left( \nabla \mathbf{u} + (\nabla \mathbf{u})^\top \right) \right]
            + \nabla \cdot \left[ \lambda (\nabla \cdot \mathbf{u}) \mathbf{I} \right] + \mathbf{a} \tag{1}
            \]
          `}
      </div>
      Numerical solution of these equations enables the simulation
      of fluid behavior in complex domains—a field known as{" "}
      <strong>Computational Fluid Dynamics</strong> (CFD). While the
      mathematical form may appear excessively complicated, the underlying
      principles can be systematically discretized in a way that is relatively
      straightforward. In this article, I outline the derivation of the
      governing equations and detail the discretization approach employed in my
      Rust-based solver,{" "}
      <a href="https://github.com/kyle-tennison/navier-2d">
        <code className="il">navier-2D</code>
      </a>
      . Feel free to use the code in this repo to help kickstart your own
      elementary CFD project.
      <h3>Preface</h3>
      CFD is an expansive and highly interdisciplinary domain. This
      article is intended as an accessible introduction for those who are just
      beginning their journey in the field. I should also note: as of writing
      this, I am currently an undergraduate student and by no means an expert in
      the field. However, I still see merit in this article for those who, like
      me, were anxious for any free, elementary information on CFD.
      <h3>Prerequisites</h3>
      The reader is assumed to have a working knowledge of vector
      calculus and linear algebra. Dot notation is occasionally used for time
      derivatives. Some familiarity with fundamental classical mechanics is
      helpful, but not necessary.
      























<h1>Derivation</h1>
      
























<h2>Stress Tensors</h2>
      <h3>Material Elements</h3>
      In CFD, it is commonly assumed (for simplicity) that
      macroscopic physical laws—such as those governing material properties and
      forces—remain valid when applied at smaller spatial scales. In reality,
      there exists a point where microscopic phenomena begin to have a
      non-negligible effect on the system. This assumption—that macroscopic behavior continues at the infinitesimal scale—is known as{" "}
      <a href="">continuum mechanics</a>, and it allows engineering problems to
      be greatly simplified.
      <br />
      <br />
      In the continuum framework, fluids and solids are modeled as
      being composed of infinitesimal "material elements" (sometimes called
      "fluid parcels/elements", depending on the context). Suppose these elements are rectangular prisms; in this model, the following
      stresses act on each face:
      <img src={materialElementPhoto}></img>
      <span className="centered">
        Material Element with annotated stresses.
      </span>
      <span className="centered">
        <em>
          From:{" "}
          <a href="https://en.wikipedia.org/wiki/Cauchy_stress_tensor">
            Cauchy Stress Tensor
          </a>
        </em>
      </span>
      <br />
      As shown in the image above, there are nine stresses (\(\sigma
      = F/A\))—three per face of the element. The subscripts correspond to the
      coordinate axes, typically assigned as \(x = 1\), \(y = 2\), and \(z =
      3\). Notable characteristics include:
      <ul>
        <li>
          Each face exhibits two <em>shear</em> stresses.
          <em>
            (Shear stresses act tangentially, lying in the plane of the face.)
          </em>
        </li>
        <li>
          Each face also experiences one <em>normal</em> stress.{" "}
          <em>(Normal stresses act perpendicularly to the face.)</em>
        </li>
      </ul>
      The typical subscript notation {String.raw`\(\sigma _{ab}\)`} marks \(a\)
      as the axis of the face and \(b\) as the direction that the stress points;
      this can be seen in the figure above.
      <br />
      <br />
      Managing nine stresses independently can be cumbersome. To
      address this, the stresses can be assembled into a{" "}
      <strong>Cauchy Stress Tensor</strong>, which is:
      {String.raw`\[\boldsymbol{\sigma} \equiv \begin{bmatrix}
            \sigma_{xx} & \sigma_{xy} & \sigma_{xz} \\
            \sigma_{yx} & \sigma_{yy} & \sigma_{yz} \\
            \sigma_{zx} & \sigma_{zy} & \sigma_{zz} \\
            \end{bmatrix}  \tag{2} \] `}
      Now, to find the stress in some direction \(\hat n\), all that is needed is:
      {String.raw`\[\hat n \cdot \boldsymbol \sigma \tag{3}\]`}
      <h3>Directional Forces</h3>
      The stresses in a body are often not uniform; because of this, 
      the opposite faces on a given material element are likely to have some small, nonzero 
      difference in stress. This is better shown with an illustration.
      <Element name="material-element-dx">
        <img src={materialElementDxPhoto} />
      </Element>
      <span className="centered">
        \(x\)-axis forces illustrated on a material element
      </span>
      <span className="centered">
        <em>
          From:{" "}
          <a href="https://en.wikipedia.org/wiki/Cauchy_momentum_equation">
            Cauchy Momentum Equation
          </a>
        </em>
      </span>
      <br />
      The stresses <em>annotated in green</em> demonstrate this nonzero difference.
      The values{" "}
      <em>at the bottom</em> of the material element have the force of:
      {String.raw`\[-\sigma_{yx}dxdz  \tag{4} \] `}
      This is the shear stress {String.raw`\(\sigma_{yx}\)`} (force/area) times
      the area of the \(dx\cdot dz\) face on the material element, which equates to a component of the
      force in the x direction. Then, comparing this to the <em>top force</em>, 
      annotated as:
      
      <Element name="eq-5">
        <div>{String.raw`\[ \left( \sigma_{yx}+\frac{\partial \sigma_{yx}}{\partial y}dy \right)dxdz  \tag{5} \]`}</div>
      </Element>

      it is apparent that the original {String.raw`\(\sigma_{yx}\)`} is modified 
      by some quantity {String.raw`\(\frac{\partial \sigma_{yx}}{\partial y} dy \)`} as 
      a means of accounting for the stress over the length of the element. This 
      is simply an application of the Taylor series.

      <br/><br/>
      The following is a brief explanation of <Link to="eq-5" smooth={true} offset={-100}>
        Eq. 5
      </Link>. The first two terms of the Taylor series are:

      {String.raw`\[f(y) \approx f(a) + \frac{df}{dy}\bigg|_{x=a} (y - a) + \underbrace{\cdots}_{\text{neglected}}  \tag{6} \]`}
      Let \(a\) be the \(y\)-value at the <em>bottom</em> of the element and let
      \(b\) be the \(y\)-value at the <em>top</em> of the element. Then, let the 
      difference between \(b-a=dy\) and substitute \(f\) for {String.raw`\( \sigma_{yx} \)`}; this yields:
      {String.raw`\[\sigma_{yx}(b) \approx \sigma_{yx} (a) + \frac{\partial \sigma_{yx}}{dy}\bigg|_{y=a} dy + \underbrace{\cdots}_{\text{neglected}}  \tag{7} \]`}
      Then, multiplying the face area \(dx \cdot dz\) by this expression provides
      the expression shown in{" "}
      <Link to="eq-5" smooth={true} offset={-100}>
        Eq. 5
      </Link>
      .

      <br /><br />
      The{" "}
      <Link to="material-element-dx" smooth={true} offset={-100}>
        image above
      </Link>{" "}
      shows the forces that act in the \(x\)-axis. Summarized, these are:
      <div className="long-horiz">
        {String.raw`
          \[
          \begin{aligned}
          F_x &= \left[ \sigma_{xx} + \frac{\partial \sigma_{xx}}{\partial x} dx \right] dy\,dz - \sigma_{xx} dy\,dz \\
          &\quad + \left[ \sigma_{yx} + \frac{\partial \sigma_{yx}}{\partial y} dy \right] dx\,dz - \sigma_{yx} dx\,dz \\
          &\quad + \left[ \sigma_{zx} + \frac{\partial \sigma_{zx}}{\partial z} dz \right] dx\,dy - \sigma_{zx} dx\,dy \\
          &= \left( \frac{\partial \sigma_{xx}}{\partial x} dx \right) dy\,dz + \left( \frac{\partial \sigma_{yx}}{\partial y} dy \right) dx\,dz + \left( \frac{\partial \sigma_{zx}}{\partial z} dz \right) dx\,dy \\
          &= \left( \frac{\partial \sigma_{xx}}{\partial x} + \frac{\partial \sigma_{yx}}{\partial y} + \frac{\partial \sigma_{zx}}{\partial z} \right) dx\,dy\,dz
          \end{aligned}
          \]
          \[
          \boxed{F_x= \frac{\partial \sigma_{xx}}{\partial x} dx\,dy\,dz + \frac{\partial \sigma_{yx}}{\partial y} dy\,dx\,dz + \frac{\partial \sigma_{zx}}{\partial z} dz\,dx\,dy} \tag{8}
          \]
          `}
      </div>
      The same can be done for the other axes. Altogether, the three axes can be represented in
      a vector \( \mathbf F_p \) that gives the net force on the element{" "}
      <em>from surface forces</em>:
      <div className="long-horiz">
        {String.raw`
          \[
          \textbf{F}_p =\begin{bmatrix}
          \frac{\partial\sigma_{xx}}{\partial_x}dxdydz+\frac{\partial \sigma_{yx}}{\partial y}dydxdz+\frac{\partial \sigma_{zx}}{\partial z}dzdxdy\\[1ex]
          \frac{\partial\sigma_{xy}}{\partial_x}dxdydz+\frac{\partial \sigma_{yy}}{\partial y}dydxdz+\frac{\partial \sigma_{zy}}{\partial z}dzdxdy\\[1ex]
          \frac{\partial\sigma_{xz}}{\partial_x}dxdydz+\frac{\partial \sigma_{yz}}{\partial y}dydxdz+\frac{\partial \sigma_{zz}}{\partial z}dzdxdy\\
          \end{bmatrix} \tag{9}
          \]
          `}
      </div>
      Notice that this can also be represented in terms of the stress tensor:
      {String.raw`\[ \mathbf F_p = (\nabla \cdot \boldsymbol \sigma)dxdydz \tag{10} \]`}
      All other <em>external forces</em> can be grouped into a vector \(\mathbf F_m\):
      {String.raw`\[\mathbf F_m = \mathbf a \rho \; dxdydz \tag{11} \]`}
      where \(\mathbf a\) is an acceleration field. This is simply an
      application of Newton's Second Law \(F = ma\), where \(\rho \; dxdydz\) is
      mass and \(\mathbf a\) is acceleration. Combining these two terms gives 
      an equation for the net force on the stress element:
      <Element name="eq-12">
        {String.raw`\[ \mathbf F = \mathbf F_m + \mathbf F_p \tag{12}\]`}
      </Element>
      <hr />
      
























<h2>Cauchy Momentum Equation</h2>
      <h3>Conservation of Momentum</h3>
      Newton's Second Law of motion states:
      {String.raw`\[\mathbf F = m \boldsymbol{\ddot x}\]`}
      and, the conservation of momentum states:
      {String.raw`\[\boldsymbol p = m \boldsymbol{\dot x}\]`}
      Taking the time derivative of both sides of the conservation of momentum gives:
      {String.raw`\[\boldsymbol {\dot p} = m \boldsymbol{\ddot x}\]`}
      Notice that the time derivative of momentum has the same
      right-hand side as Newton's Second Law. From this, it is clear that:
      <Element name="eq-13">{String.raw`\[\mathbf F = \boldsymbol{\dot p} \tag{13} \]`}</Element>
      Substituting{" "}
      <Link to="eq-12" smooth={true} offset={-100}>
        Eq. 12
      </Link>{" "}
      into <Link to="eq-13" smooth={true} offset={-100}>
        Eq. 13
      </Link>{" "} 
      gives:
      {String.raw`\[ \boldsymbol{\dot p}= \mathbf F_p + \mathbf F_m = (\nabla\cdot \boldsymbol{\sigma})dxdydz+\textbf{a}\rho dxdydz \tag{14} \]`}
      Consider the original definition{" "}
      {String.raw`\(\boldsymbol p = m \boldsymbol{\dot x}\)`}; if velocity is denoted as \( \textbf u \), such that{" "}
      {String.raw`\(\textbf u = \boldsymbol{\dot x} \)`}, Eq. 14 can be rewritten as:
      {String.raw`
        \[ \boldsymbol{\dot u}m=(\nabla \cdot \boldsymbol{\sigma})dxdydz + \boldsymbol{f}\rho\;dxdydz \]
        `}
      And because \(m = \rho \; dxdydz \), this becomes
      {String.raw`
        \[ \boldsymbol{\dot u}\rho\;dxdydz=(\nabla \cdot \boldsymbol{\sigma})dxdydz + \boldsymbol{f}\rho\;dxdydz \]
        `}
      And, after cancelling \(dxdydz\), this yields:
      {String.raw`\[
        \boldsymbol{\dot u} \rho = (\nabla \cdot \boldsymbol \sigma) + \mathbf a \rho \tag{15}
        \]`}
      Or, after dividing both sides by \(\rho \) and expressing{" "}
      {String.raw`\(\boldsymbol {\dot u} \)`} as a{" "}
      <a href="https://en.wikipedia.org/wiki/Material_derivative">
        Material Derivative
      </a>{" "}
      (which is simply acknowledging that velocity will change with both
      space and time), the result is:
      <Element name="eq-16">
        {String.raw`\[
            \boxed{ \frac{D\textbf{u}}{Dt}=\frac{1}{\rho}\nabla\cdot\boldsymbol{\sigma}+\textbf{a} } \tag{16}
            \]`}
      </Element>
      This is the <strong>Cauchy Momentum Equation</strong>, which gives a
      relationship between acceleration, mass, and external forces.

      <h3>Conservation Form</h3>
      The form of the Cauchy Momentum Equation in{" "}
      <Link to="eq-16" smooth={true} offset={-100}>
        Eq. 16
      </Link>{" "}
      is known as the <em>non-conservative</em> form. To derive the
      Navier-Stokes equations, it is necessary to reform the equation slightly to
      make things work.
      First, it is important to distinguish <em>Deviatoric Stress</em> from{" "}
      <em>Hydrostatic Stress</em>. <br />
      <br />
      <strong>Hydrostatic stress</strong> \(\sigma _h\) (also known as
      isotropic/volumetric stress) is the average <em>normal</em> stress of the
      tensor. Hydrostatic stress is analogous to pressure; it will squeeze the
      element uniformly on all sides, but will not change its shape. Mathematically,
      this is represented as:
      {String.raw`\[
        
        \sigma_h = \frac{ \sigma_{11} + \sigma_{22} + \sigma_{33} }{3} \tag{17}
        \]`}
      <strong>Deviatoric Stress</strong> \(\boldsymbol \tau \) takes the form of
      a "stress deviator tensor." These represent the stresses that tend to
      deform the body. The stress tensor \(\boldsymbol \sigma \) can be
      represented as the sum of these two stresses. <em>The actual 
      definition of this tensor is provided later in this article.
      </em>

      <br/><br/>
      Now, because there are two partitions, \( \boldsymbol \sigma
      \) can be replaced with:
      {String.raw`
        \[ \boldsymbol \sigma = \boldsymbol \tau + \sigma _h \mathbf I_3 \tag{19} \]
        `}
      where \(\mathbf I_3 \) is the 3x3 identity matrix. Substituting this into{" "}
      <Link to="eq-16" smooth={true} offset={-100}>
        Eq. 16
      </Link>{" "}
      gives:
      {String.raw`\[
        \begin{aligned}
        \frac{D\textbf{u}}{Dt} 
        &= \frac{1}{\rho} \nabla \cdot (-p\textbf{I} + \boldsymbol{\tau}) + \textbf{a} \\
        &= \frac{1}{\rho} \left( \nabla \cdot (-p\textbf{I}) + \nabla \cdot \boldsymbol{\tau} \right) + \textbf{a} \\
        &= \frac{1}{\rho} \left( -\nabla p + \nabla \cdot \boldsymbol{\tau} \right) + \textbf{a}\\
        \rho \frac{D\textbf{u}}{Dt}  &=-\nabla p + \nabla \cdot \boldsymbol{\tau}+\rho\textbf{a}
        \end{aligned} \\
        \]`}
      Then, because a{" "}
      <a href="https://en.wikipedia.org/wiki/Material_derivative">
        Material Derivative
      </a>{" "}
      is defined as{" "}
      {String.raw`\( \frac{Dy}{Dt} \equiv \frac{\partial y}{\partial t} + \textbf{u}\cdot \nabla y \)`} (where \(\textbf u\) is velocity), this expands to:
      <Element name="eq-20">
        {String.raw`\[
            \boxed{\rho\left(\frac{\partial \textbf{u}}{\partial t}\right)+\rho (\textbf{u}\cdot \nabla)\textbf{u}=-\nabla p+\nabla \cdot \boldsymbol \tau + \rho \textbf a} \tag{20}
            \]`}
      </Element>
      This is the <strong>Conservation Form</strong> of the Cauchy Momentum
      Equation, and this is what will be used to obtain the Navier-Stokes
      Equations.
      <hr/>
      
























<h2>Newtonian Fluids</h2>
      A Newtonian fluid satisfies the following
      assumptions:
      <ol>
        <li>The fluid is isotropic.</li>
        <li>At rest, \( \nabla \cdot \boldsymbol \tau = 0 \).</li>
        <li>
          The stress tensor \(\boldsymbol \sigma \) is a linear function of the
          strain rate tensor (or, equivalently, the velocity gradient).
        </li>
      </ol>
      The points are considered in more detail below. <br />
      <br />
      <h3>1. Isotropy</h3>
      An <strong>isotropic</strong> fluid is simply a fluid with properties that
      do not change depending on direction. Non-isotropic (anisotropic)
      properties are easier to conceptualize for solids—such as wood, which is
      stronger depending on its grain direction. Most day-to-day
      fluids encountered are isotropic.
      <br />
      <br />
      <h3>2. \( \nabla \cdot \boldsymbol \tau = 0 \) at rest</h3>
      Asserting that \( \nabla \cdot \boldsymbol \tau = 0 \) means that, in the
      absence of motion or deformation, there are no net internal shear forces
      acting within the fluid. This simply states that the fluid will reach
      static equilibrium if left to rest. This property can be illustrated more clearly with{" "}
      <Link to="eq-20" smooth={true} offset={-100}>
        Eq. 20
      </Link>{" "}
      by setting{" "}
      {String.raw`\( \frac{D \mathbf u}{Dt} = \left(\frac{\partial \textbf{u}}{\partial t}\right)+ (\textbf{u}\cdot \nabla) =0  \)`}
      , which just indicates that velocity is constant (at zero) at rest.
      {String.raw`\[
        
        \cancel{\rho\left(\frac{\partial \textbf{u}}{\partial t}\right)+\rho (\textbf{u}\cdot \nabla)\textbf{u}}=-\nabla p+\nabla \cdot \boldsymbol \tau + \rho \textbf a = 0

        \]`}
      Which, rearranged, is:
      {String.raw`\[
        
        \nabla \cdot \boldsymbol \tau = \nabla p - \rho \mathbf a \qquad \text{(at rest)}

        \]`}
      Thus, if \(\nabla \cdot \boldsymbol \tau \) is to be zero, \(\nabla p - \rho \mathbf a \) must also be zero, indicating that Newtonian
      fluids are fluids whose pressure gradient will balance to match the
      acceleration field. If there is no acceleration field, it can be said that the
      pressure gradient will be zero, meaning pressure will be uniform across
      the fluid at rest.
      <h3>3. Strain Rate Tensor</h3>
      The <strong>Strain Tensor</strong> is similar to the stress tensor, but
      instead of describing the stress in each axis, it describes the strain in
      each axis:
      <div className="long-horiz">
        {String.raw`
          \[
          \underline{\underline{\epsilon}} =
          \begin{bmatrix}
          \epsilon_{xx} & \epsilon_{xy} & \epsilon_{xz} \\
          \epsilon_{yx} & \epsilon_{yy} & \epsilon_{yz} \\
          \epsilon_{zx} & \epsilon_{zy} & \epsilon_{zz}
          \end{bmatrix}
          =
          \begin{bmatrix}
          \epsilon_{xx} & \frac{1}{2}\gamma_{xy} & \frac{1}{2}\gamma_{xz} \\
          \frac{1}{2}\gamma_{yx} & \epsilon_{yy} & \frac{1}{2}\gamma_{yz} \\
          \frac{1}{2}\gamma_{zx} & \frac{1}{2}\gamma_{zy} & \epsilon_{zz}
          \end{bmatrix}
          \tag{21}
          \]
          `}
      </div>
      Strain in 1D is usually shown as \( \epsilon = \Delta L / L\) (where \(L\)
      is the length), which is equivalent to saying \(\epsilon_x = \partial d /
      \partial x \) where \(d\) is the <em>displacement field</em>.

      <br/><br/>
      <em>
        Note: The displacement field is often shown as \(u\), but \(u\) is
        reserved for velocity in this article.
      </em>

      <br/><br/>
      In two dimensions, <em>normal</em> strain still takes the form of{" "}
      {String.raw`\( \epsilon _{xx}=  \frac{\partial u_x}{\partial x} \)`},{" "}
      {String.raw`\( \epsilon _{yy}=  \frac{\partial u_y}{\partial y} \)`},
      etc. However, <em>shear</em> strain needs to represent angular distortion
      between axes, and for this reason is defined as:{" "}
      {String.raw`\( \epsilon_{xy} = \frac{1}{2}(\frac{\partial u_x}{\partial y} + \frac{\partial u_y}{\partial x}) \)`}
      . This can be combined into the following expression for strain:
      <Element name="eq-22">
        {String.raw`\[
          \epsilon _{ij} = \frac12 (\frac{\partial d_i}{\partial x_j}+\frac{\partial d_j}{\partial x_i}) \tag{22}
          \]`}
      </Element>
      For normal stresses, where \(i=j\), the two terms are equal and the expression
      simplifies into a single term. Otherwise, the two terms account for the
      angular distortion. Note that this equation is only valid for 2D. See more about{" "}
      <a href="https://en.wikipedia.org/wiki/Strain_(mechanics)">strain</a>{" "}
      here.
      <br />
      <br />
      Taking the time derivative of both sides of <Link to="eq-22" smooth={true} offset={-100}>Eq. 22</Link> gives:
      {String.raw`\[
        
        \dot \epsilon _{ij} = \frac12 (\frac{\partial u_i}{\partial x_j}+\frac{\partial u_j}{\partial x_i}) \tag{23}

        \]`}
      Which, written in vector form, is:
      <Element name="eq-24">
        {String.raw`\[
            \boxed{\boldsymbol {e} =  \frac{1}{2}\left(\nabla \textbf u + (\nabla \textbf u)^T \right)} \tag{24}
            \]`}
      </Element>
      This is the <strong>Strain-Rate Tensor</strong>, which describes the
      change in strain with respect to time. 
      For further information, see <a href="https://en.wikipedia.org/wiki/Strain-rate_tensor">here</a>.
      <br />
      <br />
      It should also be noted that the{" "}
      <a href="https://en.wikipedia.org/wiki/Trace_(linear_algebra)">
        trace
      </a>{" "}
      of this tensor can be expressed as:
      <Element name="eq-25">
        {String.raw`\[
            \textbf{tr(e)} = \nabla \cdot \textbf u \tag{25}
            \]`}
      </Element>
      The Stress Deviator Tensor, first mentioned in{" "}
      <Link to="eq-18" smooth={true} offset={-100}>Eq. 18</Link>
      , can (for reasons beyond the scope of this article) be expressed in terms of
      the Strain-Rate Tensor. The relationship is fixed by two physical
      constants, \(A\) and \(B\), shown below:
      {String.raw`\[
        
        \boldsymbol \tau = A \textbf e + B (\;\textbf{tr(e)}\;)\textbf I \tag{26}

        \]`}
      Physically, it is found that \(A = 2 \mu\) and \(B = \lambda\), where
      \(\mu\) is <strong>shear viscosity</strong> and \(\lambda\) is{" "}
      <strong>bulk viscosity</strong>. Substituting these values into the above
      equation (26), along with the properties in{" "}
      <Link to="eq-24" smooth={true} offset={-100}>
        Eq. 24
      </Link>{" "}
      and{" "}
      <Link to="eq-25" smooth={true} offset={-100}>
        Eq. 25
      </Link>
      , yields:
      {String.raw`\[
            
            \boldsymbol \tau = \mu \left( \nabla \textbf u + (\nabla \textbf u)^T \right)+\lambda (\nabla \cdot \textbf u) \textbf I \tag{27}

            \]`}
      <em>Finally,</em> substituting this equation (27) into the Cauchy
      Momentum Equation defined in{" "}
      <Link to="eq-20" smooth={true} offset={-100}>
        Eq. 20
      </Link>{" "}
      leads to the <strong>Navier-Stokes Equations</strong>:
      <div className="long-horiz">
        <Element name="eq-28">
          {String.raw`\[
        
                  \boxed{\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \nabla \cdot \Big[ \lambda (\nabla \cdot \textbf u) \textbf I \Big] + \textbf a } \tag{28}
        
                  \]`}
        </Element>
      </div>
      <hr/>
      

<h2>Continuity Equation</h2>
      Paired with the Navier-Stokes equation is often a{" "}
      <em>Continuity Equation</em> that enforces the conservation of mass. This equation is briefly derived here. Let mass be defined as:
      {String.raw`\[
        m = \iiint\limits_V\rho(\textbf{x},t)dV
        \]`}
      where \(\rho\) is density and \(\textbf x\) is a generic coordinate. Taking the material derivative of both sides gives:
      <div className="long-horiz">
        {String.raw`\[
          \begin{aligned}
          \frac{Dm}{Dt}&=\frac{D}{Dt} \iiint \limits \rho(\textbf{x}, t)dV\\
          &=\iiint\limits_V\left(\frac{\partial \rho}{\partial t} + \textbf{u} \cdot \nabla \rho \right)dV=\iiint\limits_V\left(\frac{\partial \rho}{\partial t} + \nabla(\rho\textbf{u})\right)dV\\
          &=\iiint\limits_V\left(\underbrace{\frac{\partial \rho}{\partial t} + \nabla(\rho)\cdot \textbf{u}}_{D \rho /D\textbf{u}}+ \rho(\nabla \cdot \textbf{u})   \right) dV\\
          &=\iiint_V\frac{D \rho}{Dt}+\rho(\nabla \cdot \textbf{u})dV = 0 \text{ (because mass is conserved)}
          \end{aligned}
          \]`}
      </div>
      If some integral over an arbitrary bound will <em>always</em> be zero,
      then the integrand must be zero (
      <em>
        This is a mathematical result of the{" "}
        <a href="https://en.wikipedia.org/wiki/Fundamental_lemma_of_the_calculus_of_variations">
          Fundamental Lemma of the Calculus of Variations
        </a>
      </em>
      ). Taking the integrand out of the integral leaves:
      <Element name="eq-29">
        {String.raw`\[
            0=\frac{D\rho}{Dt}+\rho(\nabla \cdot \textbf{u}) \tag{29}
            \]`}
      </Element>
      Which, once the material derivative is expanded, can equivalently be
      expressed as:
      <Element name="eq-30">
        {String.raw`\[
            \boxed{0=\frac{\partial \rho}{\partial t} + \nabla \cdot ( \rho \textbf{u})} \tag{30}
            \]`}
      </Element>
      This is the <strong>Continuity Equation</strong>, which simply
      asserts the conservation of mass.
      <hr/>
      


<h2>Incompressible Flow</h2>
      Up to this point, all derived equations operate solely on the assumptions made
      for isotropic Newtonian fluids. These equations
      can be reduced significantly by making the assumption that the fluid being studied is{" "}
      <strong>incompressible</strong>. This is a good assumption for water-based
      liquids, but a poor assumption for gases.{" "}
      <strong>
        The remainder of this article will operate on the assumption that the fluid
        is incompressible.
      </strong>
      <br />
      <br />
      Incompressible fluids have the following ideal properties:
      <ol>
        <li>\(\lambda = 0\)</li>
        <li>\(D\mu / Dt = 0\) (i.e. \(\mu \) is constant.)</li>
        <li>\(D \rho / Dt = 0 \) (i.e. \(\rho \) is constant.)</li>
      </ol>
      <h3>Reduced Continuity Equation</h3>
      Because \(D \rho / Dt = 0 \), it is easy to see how{" "}
      <Link to="eq-29" smooth={true} offset={-100}>
        Eq. 29
      </Link>{" "}
      can be reduced:
      <Element name="eq-31">
        {String.raw`
            \[ 0=\cancel{\frac{D\rho}{Dt}}+\rho(\nabla \cdot \textbf{u}) \]
            
            \[ \boxed{0=\nabla \cdot \textbf u} \tag{31} \]
            `}
      </Element>
      This is the <strong>Continuity Equation for Incompressible Fluids</strong>
      .<h3>Reduced Navier-Stokes Equations</h3>
      Because \(\lambda = 0\),{" "}
      <Link to="eq-28" smooth={true} offset={-100}>
        Eq. 28
      </Link>{" "}
      reduces to:
      <div className="long-horiz">
        {String.raw`
          \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \cancel{\nabla \cdot \Big[ \lambda (\nabla \cdot \textbf u) \textbf I \Big]} + \textbf a\]
          \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \textbf a\]
          `}
      </div>
      Then, because \(\mu\) is a constant, the right-hand side can be
      rearranged as:
      <div className="long-horiz">
        {String.raw`
          \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \mu \nabla \cdot \Big[\left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \textbf a\]
          `}
      </div>
      And, because{" "}
      <Link to="eq-31" smooth={true} offset={-100}>
        Eq. 31
      </Link>{" "}
      states that \(\nabla \cdot \textbf u = 0\), the term \(\nabla \cdot
      (\nabla \textbf u + (\nabla \textbf u)^T)\) reduces to \(\nabla ^2 \textbf
      u\), leaving:
      {String.raw`
        \[ \rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \mu \nabla^2 \textbf u + \textbf a \]
        `}
      Rearranging this equation for \(\partial \textbf u / \partial t\) yields:
      <div className="long-horiz">
        <Element name="eq-32">
          {String.raw`\[
              \boxed{\frac{\partial \textbf u}{\partial t}= - \frac{1}{\rho} \nabla p+ \frac{\mu}{\rho} \nabla ^2 \textbf u + \frac{1}{\rho}\textbf a-(\textbf u \cdot \nabla \textbf u)} \tag{32}
              \]`}
        </Element>
      </div>
      This is the <strong>Navier-Stokes Equation</strong> for an incompressible
      fluid. This is the equation that governs the CFD simulation.



<h1>Numerical Approximation</h1>
      Now that the analytical form of the Navier-Stokes
      equation has been derived, all that remains is the discretization of the problem. The
      following demonstrates the steps to reach a 2D solution, but a similar
      approach can be used in 3D as well. Code is provided in Rust, though it can
      easily be adapted to any other language. The full example code can be
      found <a href="https://github.com/kyle-tennison/navier-2d">here</a> on
      GitHub.
      <img src={carSim} />
      <span className="centered">
        Example code simulation output. <br/><code className="il">cargo run --release -- sample-masks/car.png --inflow-x 10 --simtime 6</code>
      </span>
      <br />
      <br />
      <hr/>
      <br />
      

<h2>Discretization</h2>
      To begin, it is first necessary to define the space in which the simulation will take
      place. The easiest way to do this is by using a{" "}
      <strong>uniform grid</strong>. Shown below is the basic idea of a
      discretized 2D grid:
      <Element name="grid-diagram">
        <img src={gridDiagram} />
      </Element>
      <span className="centered">3x3 uniform-grid discretization</span>
      <br/>
      In a computer, this grid will be represented by a matrix. For this reason,
      the \((0,0)\) point is defined at the top left corner (i.e. row=0, col=0).
      The two axes notations are also denoted: the \(x, y\) axes and
      the \(i, j\) axes. The primary difference here is the ordering: in
      matrices, the row index comes first, then the column \((i, j)\); whereas in Cartesian
      space, the x-axis is typically indexed first, then the y-axis \((x, y)\). It
      is a subtle difference, but mixing the two up can lead to much
      confusion.
      <br/>
      <br/>
      <hr/>
      <br/>
      

<h2>Gradients</h2>
      The <strong>Gradient</strong> of a function is simply a vector:
      {String.raw`
        \[
        \nabla f(\mathbf{x}) = \left[ \frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \dots, \frac{\partial f}{\partial x_n} \right]^T \tag{33}
        \]
        `}
      Each term {String.raw`\( {\partial f} / {\partial x_n} \)`} needs to be
      calculated at each point of the discretized grid. For this reason, each of
      these terms are also matrices, which I'll henceforth refer to as{" "}
      <strong>Scalar Fields</strong>—i.e. a 2D field with a scalar value at each
      point. Because the above equation gives a <em>vector</em> of{" "}
      <em>scalar fields</em>, we end up with a <strong>Vector Field</strong>
      —i.e. a 2D field with a vector value at each point.
      <br />
      <br />
      To compute the gradient of a 2D function (which is also just a Scalar
      Field), we can compute the gradient in each direction separately, then
      stack the two together afterwards. There are a few methods in which we can
      do this; the two of particular interest in this article are: Finite
      Differences and Upwind Schemes.
      <br />
      <br />
      The <strong>Finite Difference Method</strong> (FDM) method is the most
      popular way to numerically approximate a derivative. Analytically,
      derivatives are defined as:
      {String.raw`\[
        f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h} \tag{34}
        \]`}
      As \(h \to 0\), the value of \(f'(x)\) approaches its true analytical
      value. If we let \(h\) remain as some finite, small but nonzero quantity,
      we can approximate the derivative using the{" "}
      <em>forward finite difference</em>, which is similarly:
      <Element name="eq-35">
        {String.raw`\[
            f'(x) \approx \frac{f(x + h) - f(x)}{h} \tag{35}
            \]`}
      </Element>
      If we do not know \(f(x+h)\), we can also use an{" "}
      <em>backwards finite difference</em>, which is:
      <Element name="eq-36">
        {String.raw`\[
            f'(x) \approx \frac{f(x) - f(x - h)}{h} \tag{36}
            \]`}
      </Element>
      If we know both \(f(x+h)\) and \(f(x-h)\), we can improve our
      approximation by taking the average of both. This is called the{" "}
      <em>central finite difference</em>.
      <Element name="eq-37">
        {String.raw`\[
            f'(x) \approx \frac{f(x + h) - f(x - h)}{2h} \tag{37}
            \]`}
      </Element>
      The function below uses the <em>central finite difference</em> for each
      node (i.e. a point on the grid) where both \(f(x+h)\) and \(f(x-h)\) are
      known, but falls back to either the <em>forwards</em> or{" "}
      <em>backwards finite difference</em> methods for nodes that lay on the
      edge of the grid, where only \(f(x+h)\) <em>or</em> \(f(x-h)\) is known.
      <br />
      <br />

      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        /// Compute the finite-difference gradient of a scalar field **in the x axis**.
        /// Uses a central finite difference for interior nodes and a first-order
        /// forward/backward (depends on side) finite difference for edge nodes.
        ///
        /// Parameters:
        /// - 'field' - A reference to the scalar field to take the gradient of
        /// - 'dx' - The size of the elements in the x-axis
        ///
        /// Returns:
        /// - A 'ScalarField' with the finite difference of each element
        pub fn gradient_x(field: &ScalarField, dx: f32) -> ScalarField {
            
            // Read number of rows & cols from input field
            let (rows, cols) = field.shape(); 
        
            // Create a new scalar field for the output gradient
            let mut df_dx: DMatrix<f32> = DMatrix::zeros(rows, cols);
        
            // Set the interior nodes using the method of central finite differences
            for r in 0..rows {
          for c in 1..(cols - 1) {
              let dfi_dx = (field.index((r, c + 1)) - field.index((r, c - 1))) / (2.0 * dx);
              *(df_dx.index_mut((r, c))) = dfi_dx
          }
            }
        
            // Fallback to forwards/backwards finite difference (1st order) for edges
            for r in 0..rows {
          let dfi_dx_left = (field.index((r, 1)) - field.index((r, 0))) / dx;
          let dfi_dx_right = (field.index((r, cols - 1)) - field.index((r, cols - 2))) / dx;
          *(df_dx.index_mut((r, 0))) = dfi_dx_left;
          *(df_dx.index_mut((r, cols - 1))) = dfi_dx_right;
            }
        
            df_dx
        }
                  `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">
        Rust implementation for a finite-difference gradient (x-axis only).
      </span>
      <br />
      Then, the same can be accomplished in the y-axis: <br />
      <br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        pub fn gradient_y(field: &ScalarField, dy: f32) -> ScalarField {
            
            let (rows, cols) = field.shape();
            let mut df_dy: DMatrix<f32> = DMatrix::zeros(rows, cols);
        
            for r in 1..(rows - 1) {
          for c in 0..cols {
              let dui_dy = (field.index((r + 1, c)) - field.index((r - 1, c))) / (2.0 * dy);
              *(df_dy.index_mut((r, c))) = dui_dy
          }
            }
        
            for c in 0..cols {
          let dui_dy_left = (field.index((1, c)) - field.index((0, c))) / dy;
          let dui_dy_right = (field.index((rows - 1, c)) - field.index((rows - 2, c))) / dy;
          *(df_dy.index_mut((0, c))) = dui_dy_left;
          *(df_dy.index_mut((rows - 1, c))) = dui_dy_right;
            }
        
            df_dy
        }
              `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">
        Rust implementation for a finite-difference gradient (y-axis only).
      </span>
      <br />A few things to note:
      <ol>
        <li>
          The x-axis boundary are the first and last <em>columns</em>, whereas
          the y-axis boundary are the first and last <em>rows</em>.
        </li>
        <li>
          In this context, the notation <code className="il">dui_dx</code> and{" "}
          <code className="il">dui_dy</code> are used; the \(i\) refers to the{" "}
          {String.raw`\(i^{th}\)`} element, not the \(i\) axis{" "}
          <Link to="grid-diagram" smooth={true} offset={-100}>
            shown above
          </Link>
          .
        </li>
      </ol>
      However, the central finite difference is not perfect. When there is a
      sharp peak, like the one in the image below, it is easy for the central
      finite difference to vastly under/over estimate the derivative at certain
      points. Often, the peak itself will be estimated to have a small
      derivative, while the immediate surrounding area will have a vastly
      overestimated derivative. If left to propagate, derivatives quickly
      approach \(\infty\) and the simulation explodes.
      <img
        src={
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/GaussianUpwind2D.gif"
        }
      />
      The Navier-Stokes equation's <strong>convective/advective</strong> term
      ends up with a sharp peak like this, and we can see how this can cause the
      simulation to diverge.
      {String.raw`\[
            \frac{\partial \textbf u}{\partial t}= - \frac{1}{\rho} \nabla p+ \frac{\mu}{\rho} \nabla ^2 \textbf u + \frac{1}{\rho}\textbf a- \underbrace{(\textbf u \cdot \nabla \textbf u)}_{\text{advection}}
        \]`}
      As mentioned, the peak is underestimated and the immediate surroundings
      are overestimated. Because the convective term is part of the time step{" "}
      {String.raw`\(\frac{\partial \textbf u}{\partial t}\)`}, the error in it
      is effectively added to the next velocity frame. An artifact of this is
      "splitting" of the peak, where the original peak is split into two peaks
      due to the inaccuracy in the central finite difference. Then, these split
      peaks propagate with each time step, creating a ripple effect of high and
      low velocities very close to each other; this phenomenon is shown in the
      image below:
      <img src={rippleAirfoil} />
      <span className="centered">
        Image of FDM ripple (blue is low velocity; white is high).
      </span>
      To address this issue, we use a <strong>upwind scheme</strong> to
      calculate the gradient. This method switches between forward (
      <Link to="eq-35" smooth={true} offset={-100}>
        Eq. 35
      </Link>
      ) and backward (
      <Link to="eq-36" smooth={true} offset={-100}>
        Eq. 36
      </Link>
      ) finite differences depending on the "flow direction". I recommend
      reading the{" "}
      <a href="https://en.wikipedia.org/wiki/Upwind_scheme">
        Wikipedia article
      </a>{" "}
      for more information. At the surface level, this is really just:
      {String.raw`\[
        f'(x) \approx 
        \begin{cases}
        \displaystyle \frac{f(x) - f(x - h)}{h} & \text{if } \alpha > 0 \\
        \displaystyle \frac{f(x + h) - f(x)}{h} & \text{if } \alpha < 0
        \end{cases} \tag{38}
        \]`}
      where \(\alpha\) is the value that we reference for flow direction. In
      code, we implement this in a similar fashion as the{" "}
      <code className="il">gradient_x</code> and{" "}
      <code className="il">gradient_y</code> functions.
      <br />
      <br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        /// Compute the gradient of a scalar field **in the x axis**. Interior
        /// nodes are computed using an upwind scheme, while edge nodes use
        /// finite differences.
        ///
        /// Parameters:
        /// - 'field' - A reference to the scalar field to take the gradient of
        /// - 'sign_field' - The field to reference for upwind/downwind direction
        /// - 'dx' - The size of the elements in the x-axis
        ///
        /// Returns:
        /// - A 'ScalarField' with the x-gradient of each element
        fn gradient_x_upwind(field: &ScalarField, sign_field: &ScalarField, dx: f32) -> ScalarField {
            
            let (rows, cols) = field.shape();
            let mut df_dx: DMatrix<f32> = DMatrix::zeros(rows, cols);
        
            // Set interior nodes using upwind scheme
            let mut dui_dx: f32;
            for r in 0..rows {
          for c in 1..(cols - 1) {
              if *sign_field.index((r, c)) > 0. { // look at sign field to choose upwind/downwind
                  dui_dx = (field.index((r, c)) - field.index((r, c - 1))) / dx;
              } else {
                  dui_dx = (field.index((r, c + 1)) - field.index((r, c))) / dx;
              }
              *(df_dx.index_mut((r, c))) = dui_dx
          }
            }
        
            // Use finite difference on edges (no alternative available)
            for r in 0..rows {
          let dfi_dx_left = (field.index((r, 1)) - field.index((r, 0))) / dx;
          let dfi_dx_right = (field.index((r, cols - 1)) - field.index((r, cols - 2))) / dx;
          *(df_dx.index_mut((r, 0))) = dfi_dx_left;
          *(df_dx.index_mut((r, cols - 1))) = dfi_dx_right;
            }
        
            df_dx
        }
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">
        Rust implementation for an upwind gradient scheme (x-axis only).
      </span>
      <br /> The same can be done in 2D. I'll omit the code here, but the
      implementation is available on{" "}
      <a href="https://github.com/kyle-tennison/navier-2d/blob/711b322fea42f4093d758cc2ac36177e14fce52a/src/sim/numeric.rs#L130">
        GitHub
      </a>
      .
      <br />
      <hr/>

<h2>Constructing terms</h2>
      To recap, we now have the following functions:
      <ul>
        <li>
          <code className="il">gradient_x</code>
        </li>
        <li>
          <code className="il">gradient_y</code>
        </li>
        <li>
          <code className="il">gradient_x_upwind</code>
        </li>
        <li>
          <code className="il">gradient_y_upwind</code>
        </li>
      </ul>
      All of these take in a <code className="il">ScalarField</code> and return
      type <code className="il">ScalarField</code>. Using these functions, we
      can make numerical representations of all of the Navier-Stokes terms.
      {String.raw`\[
        \frac{\partial \textbf u}{\partial t} = 
        \underbrace{- \frac{1}{\rho} \nabla p}_{\text{pressure}} + 
        \underbrace{\frac{\mu}{\rho} \nabla^2 \textbf u}_{\text{viscous}} + 
        \underbrace{\frac{1}{\rho} \textbf a}_{\text{external}} - 
        \underbrace{(\textbf u \cdot \nabla \textbf u)}_{\text{advective}}
        \]`}
      To simplify things in this simulation, we'll let{" "}
      {String.raw`\(\frac{1}{\rho} \textbf a = 0 \)`} and only worry about the
      other terms. Because \(\textbf a \) is an <em>external</em> field, it
      would be given anyways and not require any solving.

      <Element name="advective-term">
        <h3>Advective Term</h3>
      </Element>
      The advective term \((\textbf u \cdot \nabla \textbf u)\) can also be
      written as \((\textbf u \cdot \nabla)\textbf u\). Note that \((\textbf u
      \cdot \nabla)\) is a <em>directional-derivative operator</em> and is not
      the same as \((\nabla \cdot \textbf u)\). Mathematically (in 2D):
      <div className="long-horiz">
        {String.raw`\[(\textbf u \cdot \nabla)\textbf F = u \frac{\partial \textbf F}{\partial x}+v \frac{\partial \textbf F}{\partial y}=\begin{bmatrix}
          u (\partial F_x/\partial x)+v(\partial F_x/\partial y)\
          u (\partial F_y/\partial x)+ v(\partial F_y/\partial y)
          \end{bmatrix} \tag{39}
          \]`}
      </div>
      So, to replicate this in code, it is as easy as:
      <ol>
        <li>Splitting the vector field into its x & y components</li>
        <li>Taking the partial derivatives of each component</li>
        <li>
          Assembling everything into a <code className="il">VectorField</code>
        </li>
      </ol>
      The following shows how this can be done with the aforementioned upwind
      gradient schemes:
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        
        pub fn advection_upwind(
            field: &VectorField,
            mask: &DMatrix<bool>,
            dy: f32,
            dx: f32,
        ) -> VectorField {
        
            // Split the field into its x and y components (u and v)
            // Note: This u is not the same as the u used for velocity
            let (u, v) = (&field[0], &field[1]);
        
            // Use the aforementioned gradient functions to compute derivatives
            let mut du_dx = gradient_x_upwind(u, u, dx);
            let mut du_dy = gradient_y_upwind(u, v, dy);
        
            let mut dv_dx = gradient_x_upwind(v, u, dx);
            let mut dv_dy = gradient_y_upwind(v, v, dy);
        
            // Zero out derivatives where the solid object is (more info below)
            zero_where_mask(&mut du_dx, mask);
            zero_where_mask(&mut du_dy, mask);
            zero_where_mask(&mut dv_dx, mask);
            zero_where_mask(&mut dv_dy, mask);
        
            // Compute advection in the x & y axes
            let adv_u = u.component_mul(&du_dx) + v.component_mul(&du_dy);
            let adv_v = u.component_mul(&dv_dx) + v.component_mul(&dv_dy);
        
            // Stack ScalarFields to get a VectorField
            [adv_u, adv_v]
        }
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">
        Numeric approximation for Advection; \( (\textbf u \cdot \nabla)\textbf
        F \)
      </span>
      A few notes here:
      <ol>
        <li>
          The <code className="il">mask</code> refers to a boolean field that
          gives <code className="il">true</code> at all points where the solid
          object is.
        </li>
        <li>
          We zero-out all the derivatives within the solid mask to avoid
          nonphysical behavior. The <code className="il">zero_where_mask</code>{" "}
          can be viewed{" "}
          <a href="https://github.com/kyle-tennison/navier-2d/blob/711b322fea42f4093d758cc2ac36177e14fce52a/src/sim/numeric.rs#L219">
            here on GitHub
          </a>
          .
        </li>
        <li>
          The <code className="il">VectorField</code> type is simply a
          two-element array of two <code className="il">ScalarField</code>{" "}
          elements. The {String.raw`\(0^{th}\)`} element is the x-axis and the{" "}
          {String.raw`\(1^{st}\)`} element is the y-axis.
        </li>
      </ol>
      <Element name="viscous-term">
        <h3>Viscous Term</h3>
      </Element>
      The viscous term {String.raw`\( \frac{\mu}{\rho} \nabla^2 \textbf u \)`}{" "}
      is simply a scalar times the <em>Laplacian</em> of the velocity field. The{" "}
      <strong>Laplace Operator</strong>
      \( \nabla^2 \) (sometimes just \( \Delta \)) really just means:
      {String.raw`\[ 
        \nabla^2 f = \sum_{i=1}^n \frac{\partial^2 f}{\partial x_i^2}  \tag{40}
    \]`}
      for each Cartesian coordinate \( x_i \). In 2D, this is:
      <Element name="eq-41">
        {String.raw`\[
            \nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2}  \tag{41}
        \]`}
      </Element>
      Using this operator is said to be <em>"taking the Laplacian."</em>
      The <strong>Vector Laplacian</strong>, i.e. the Laplacian for a vector
      field, is:
      {String.raw`\[ 
        \nabla^2 \textbf{A} = \nabla(\nabla \cdot \textbf{A}) - \nabla \times (\nabla \times \textbf{A}) \tag{42}
    \]`}
      However, for \(\mathbb R^2\) Cartesian coordinates, this is simply:
      {String.raw`\[ 
        \nabla^2 \textbf{A} = (\nabla^2 A_x, \nabla^2 A_y) \tag{43}
     \]`}
      <em>
        You can read more about the Laplace Operator{" "}
        <a href="https://en.wikipedia.org/wiki/Laplace_operator">here</a>.
      </em>
      <br />
      <br />
      Notice that the <em>vector Laplacian</em> (in Cartesian coordinates) is
      simply the <em>scalar Laplacian</em> of each of its components. In code,
      we can easily define a <code className="il">Laplacian</code> function for{" "}
      <code className="il">ScalarField</code>s, then make a{" "}
      <code className="il">Laplacian_vf</code> function for{" "}
      <code className="il">VectorField</code>s that calls{" "}
      <code className="il">Laplacian</code> and simply stacks the result.
      <br />
      <br />
      It is fairly straightforward to implement this. For{" "}
      <code className="il">ScalarField</code>s, the function is:
      <br />
      <br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        pub fn Laplacian(field: &ScalarField, dy: f32, dx: f32) -> ScalarField {
            // First-order derivatives
            let df_dx = gradient_x(field, dx);
            let df_dy = gradient_y(field, dy);
        
            // Second-order derivatives
            let d2f_dx2 = gradient_x(&df_dx, dx);
            let d2f_dy2 = gradient_y(&df_dy, dy);
        
            d2f_dx2 + d2f_dy2
        }
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">Numeric Laplacian implementation in Rust</span>
      <br />
      Then, for <code className="il">VectorField</code>s, it is simply:
      <br />
      <br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        pub fn Laplacian_vf(field: &VectorField, dy: f32, dx: f32) -> VectorField {
            let (u, v) = (&field[0], &field[1]);
        
            [Laplacian(u, dy, dx), Laplacian(v, dy, dx)]
        }
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <span className="centered">
        Numeric Vector Laplacian implementation in Rust
      </span>
      <Element name="pressure-gradient">
        <hr/>
      </Element>
        
<h2>Pressure Gradient</h2>
      The pressure term {String.raw`\( - \frac{1}{\rho} \nabla p \)`} is the
      most difficult part of the equation to calculate. To solve for this,
      an <em>intermediate</em> velocity \(\textbf u^*\) is projected—this is
      the <em>velocity with neglected pressure</em>. This can be found by
      discretizing the Navier-Stokes Equation without the \(- \nabla p\) term:
      {String.raw`\[
            \rho \frac{\textbf u^*-\textbf u_i}{\Delta t}=\mu \nabla^2\textbf u_i+\textbf a_i- \rho(\textbf u_i \cdot \nabla \textbf u_i)
        \]`}
      Rearranged for \(\textbf u^*\), this is:
      <div className="long-horiz">
        <Element name="eq-44">
          {String.raw`\[
                  \textbf u^*=\textbf u_i+\frac{\Delta t}{\rho}\left(\mu \nabla^2\textbf u_i+\textbf a_i- \rho(\textbf u_i \cdot \nabla \textbf u_i)\right) \tag{44}
              \]`}
        </Element>
      </div>
      At this point, the divergence \(\nabla \cdot \textbf u^* \ne 0\)
      (usually). Then, \( \textbf u^* \) is <em>corrected</em> by some pressure to
      obtain the corrected {String.raw`\( \textbf u_{i+1} \)`}:
      <Element name="eq-45">
        {String.raw`\[
                \textbf u_{i+1}=\textbf u^*+\frac{\Delta t}{\rho}\left(-\nabla p_{i+1}\right) \tag{45}
            \]`}
      </Element>
      In essence, the previously omitted pressure term (that is currently not known) is now added back. At this stage, the condition{" "}
      {String.raw`\(\nabla \cdot \textbf u_{i+1}=0\)`} can be enforced. This is achieved by taking
      the divergence of both sides of the equation above:
      {String.raw`\[    \begin{aligned}
        0=\nabla \cdot \textbf u_{i+1}&=\nabla\cdot \left[ \textbf u^*+\frac{\Delta t}{\rho}(-\nabla p_{i+1})\right]\\

        &=\nabla\cdot \textbf u^* - \frac{\Delta t}{\rho}\nabla^2p_{i+1}\\
        \end{aligned}
    \]`}
      <Element name="eq-46">
        {String.raw`\[
            \boxed{\nabla^2p_{i+1}=\frac{\rho}{\Delta t}\nabla \cdot \textbf u^*} \tag{46}
        \]`}
      </Element>
      This equation must be numerically approximated to solve for the
      pressure \(p\). Fortunately, it is a <em>Poisson equation</em>,
      meaning it is, generically, in the form:
      {String.raw`\[
        \nabla ^2 p = b
        \]`}
      From{" "}
      <Link to="eq-41" smooth={true} offset={-100}>
        Eq. 41
      </Link>
      , it is known that the left-hand side of this equation can be broken into two
      second-order partial derivatives. To express this numerically, a
      <em>second-order finite difference</em> is used:
      {String.raw`\[
            f''(x) \approx \frac{f(x + h) - 2f(x) + f(x - h)}{h^2} \tag{47}
        \]`}
      So, for the 2D scalar field \(p\), this becomes:
      <div className="long-horiz">
        {String.raw`\[
              \nabla^2 p \approx \frac{p_{i+1,j} - 2p_{i,j} + p_{i-1,j}}{\Delta x^2} + \frac{p_{i,j+1} - 2p_{i,j} + p_{i,j-1}}{\Delta y^2} \tag{48}
          \]`}
      </div>
      Plugging this into{" "}
      <Link to="eq-46" smooth={true} offset={-100}>
        Eq. 46
      </Link>{" "}
      gives a system of equations that can be solved with a matrix.
      <div className="long-horiz">
        <Element name="eq-49">
          {String.raw`\[
                  \frac{p_{i+1,j} - 2p_{i,j} + p_{i-1,j}}{\Delta x^2} + \frac{p_{i,j+1} - 2p_{i,j} + p_{i,j-1}}{\Delta y^2} = \frac{\rho}{\Delta t}\nabla \cdot \textbf u^* \tag{49}
              \]`}
        </Element>
      </div>
      If \(\Delta x = \Delta y = h\), this can be rearranged into the
      simpler form:
      <div className="long-horiz">
        <Element name="eq-50">
          {String.raw`\[
                  - \left( p_{i-1,j} + p_{i+1,j} + p_{i,j-1} + p_{i,j+1} \right) + 4p_{i,j} = \left(\frac{\rho}{\Delta t}\nabla \cdot \textbf u^* \right) \, h^2 \tag{50}
              \]`}
        </Element>
      </div>
      where \(h=\Delta x=\Delta y\).
      
      <h3>Boundary Conditions</h3>
      Before this equation can be solved, boundary conditions must be enforced to reach a unique solution. There are two
      kinds of boundary conditions:
      <ol>
        <li>
          A <strong>Dirichlet Boundary Condition</strong>{" "}
          <em>fixes the solution</em> of a differential equation at the
          boundaries. These are called boundary conditions of the{" "}
          <em>first type</em>. For instance, in the ODE:
          {String.raw`\[y''+y=0\]`}
          The boundaries would be:
          {String.raw`\[y(a)=\alpha \quad \text{and}\quad y(b)=\beta\]`}
        </li>
        <li>
          A <strong>Neumann Boundary Condition</strong> specifies the{" "}
          <em>derivative</em> of a differential equation at the boundary. For
          instance, in the ODE:
          {String.raw`\[y''+y=0\]`}
          The boundaries would be:
          {String.raw`\[y'(a)=\alpha \quad \text{and}\quad y'(b)=\beta\]`}
        </li>
      </ol>
      For this simulation, the following boundary conditions are enforced:
      <ol>
        <li>
          There is <strong>no slip</strong> on the walls, meaning that the fluid
          touching the wall moves at the same rate as the rest of the fluid.
          Mathematically, this is \(\partial \textbf u / \partial \eta = 0\)
          (where \(\eta\) represents any spatial axis). Because the derivative is constrained, this is a <strong>Neumann</strong>{" "}
          boundary condition. For a more realistic scenario (e.g., microflows or
          rarefied gases), partial slip can be allowed by setting a nonzero slip
          length or surface velocity, rather than enforcing a strict no-slip
          condition.
        </li>
        <li>
          The fluid pressure within the solid object is zero. This sets a
          fixed value to the pressure function, making this a{" "}
          <strong>Dirichlet</strong> condition.
        </li>
      </ol>
      <h3>Implementation</h3>
      In code, each \((i,j)\) point is iterated over to assemble a system of
      equations in the form:
      {String.raw`\[
        \textbf A p =  b
        \]`}
      where \(\textbf A p\) represents \(\nabla ^2 p\) or the left-hand side of{" "}
      <Link to="eq-50" smooth={true} offset={-100}>
        Eq. 50
      </Link>
      . To do this, <em>the fields must be flattened</em> from
      \(\mathbb R^2 \to \mathbb R\). This means each ordered pair \((i,
      j)\) will now be represented by an index \(k\). Things quickly get
      complicated when swapping between these two coordinate
      systems, so to mitigate this, a small function (shown as{" "}
      <code className="il">ij_to_k</code> in the function below) is defined to convert
      \((i, j) \to k\). Mathematically, this is simply:
      <Element name="eq-51">
        {String.raw`\[
                k = i + jN \tag{51}
            \]`}
      </Element>
      where \(N\) is the number of rows.
      <br /><br />
      Now, the following steps can be used:
      <ol>
        <li>
          Implement a way to map between coordinate systems, as shown in{" "}
          <Link to="eq-51" smooth={true} offset={-100}>
            Eq. 51
          </Link>
          .
        </li>
        <li>
          Flatten the <code className="il">field</code> (i.e. \( b\); the
          right-hand side of{" "}
          <Link to="eq-50" smooth={true} offset={-100}>
            Eq. 50
          </Link>
          ) from a 2D <code className="il">ScalarField</code> into a column
          vector.
        </li>
        <li>
          Iterate over each \((i, j)\) point in the field and...
          <ol type="a">
            <li>
              If the current point is within the solid object (the{" "}
              <code className="il">mask</code>), set the Dirichlet condition
              that {String.raw`\(p_{ij}=0\)`}
            </li>
            <li>
              For all other points, populate the matrix \(\textbf A\) such that
              \(\textbf A p\) matches the left-hand side of{" "}
              <Link to="eq-50" smooth={true} offset={-100}>
                Eq. 50
              </Link>
              .
            </li>
          </ol>
        </li>
      </ol>
      <br /><br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
        >
          {String.raw`
        
        pub fn poisson_solve(field: &ScalarField, mask: &DMatrix<bool>, step_size: f32) -> ScalarField {
            // 1. Create a mapping between the two coordinate systems
            let (rows, cols) = field.shape();
            let ij_to_k = { |(i, j): (i32, i32)| (i + j * (rows as i32)) as usize };
        
            // Construct a matrix to hold the A matrix (I'm using sparse memory allocation here)
            let mut a_coo: CooMatrix<f32> = CooMatrix::new(rows * cols, rows * cols);
        
            // 2. flatten RHS into a vector
            let mut field_flat: DVector<f32> = DVector::from_row_slice(field.as_slice());
        
            // 3. iterate over field, load coordinate matrix
            for i in 0..rows {
          for j in 0..cols {
              let k = ij_to_k((i as i32, j as i32));
              // 3a. Dirichlet condition that p=0 inside the mask
              if *mask.index((i, j)) {
                  a_coo.push(k, k, 1.);
                  *(field_flat.index_mut(k)) = 0.;
                  continue;
              }
              // 3b. Apply all other points. Use this stencil to get other values
              for (di, dj) in [(-1, 0), (1, 0), (0, -1), (0, 1)] {
                  let (ni, nj) = ((i as i32) + di, (j as i32) + dj);
        
                  // Populate A matrix with the neighboring point *if* it is not
                  // a boundary point
                  if (0 <= ni && ni < rows as i32)
                      && (0 <= nj && nj < cols as i32)
                      && !(*mask.index((ni as usize, nj as usize)))
                  {
                      let nk = ij_to_k((ni, nj));
                      a_coo.push(k, nk, -1.);
                  }
                  // If the neighboring point is on a boundary, exclude it from
                  // the A here to enforce Neumann condition that dp/dn = 0 on
                  // the boundary.
              }
              // Add center coefficient at the end to finish 3b
              a_coo.push(k, k, 4 as f32);
              *(field_flat.index_mut(k)) = -field.index((i, j)) * (step_size.powi(2));
          }
            }
        
        // -- snip --
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br /><br />
      This provides a matrix representing \(\textbf A\) as shown above. At this point,
      the following needs to be done:
      <ol>
        <li>
          Pin the pressure to zero at some point to ensure a unique
          solution.
        </li>
        <li>Solve the system.</li>
      </ol>
      The first part, pinning the pressure, is very simple; an
      arbitrary point in \(b\) is set to zero. Solving the matrix can be done in a variety of ways. In this code, the{" "}
      <a href="https://docs.rs/argmin/latest/argmin/">
        <code className="il">argmin</code>
      </a>{" "}
      numerical optimization crate is used to apply a{" "}
      <a href="https://en.wikipedia.org/wiki/Conjugate_gradient_method">
        Conjugate Gradient
      </a>{" "}
      iterative approach, but this is only one possible method.
      <br /><br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={true}
          startingLineNumber={49}
        >
          {String.raw`
        
        // -- snip --
        
            *(field_flat.index_mut(0)) = 0.; // pin pressure
        
            let a_csr = CsrMatrix::from(&a_coo); // convert to csr sparse
        
            // solve system
            let b: Vec<f32> = field_flat.iter().copied().collect();
            let solver: ConjugateGradient<Vec<f32>, f32> = ConjugateGradient::new(b);
            let initial_guess: Vec<f32> = vec![0.0; field_flat.nrows()];
            let operator = ConjugateGradientOperator { a: &a_csr };
        
            let res = match Executor::new(operator, solver)
          .configure(|state| {
              state
                  .param(initial_guess)
                  .max_iters(MAX_CG_ITER)
                  .target_cost(TARGET_CG_COST)
          })
          .run()
            {
          Ok(r) => r,
          Err(err) => {
              panic!("Conjugate Gradient error: {err}");
          }
            };
        
            let best_param = res
          .state()
          .best_param
          .as_ref()
          .expect("Conjugate Gradient failed.")
          .to_owned();
        
            DMatrix::from_vec(rows, cols, best_param)
        }
          `.trim()}
        </SyntaxHighlighter>
      </div>
      <br /><br />
      See the{" "}
      <a href="https://github.com/kyle-tennison/navier-2d/blob/master/src/sim/poisson.rs">
        GitHub
      </a>{" "}
      repository for the full implementation of the Conjugate Gradient solution.
      <hr/>
      

  <h2>Timestepping</h2>
      Now, a general method for solution can be outlined:
      <ol>
        <li>
          Calculate the{" "}
          <Link to="advective-term" smooth={true} offset={-100}>
            Advective
          </Link>{" "}
          (\( \textbf u_i \cdot \nabla \textbf u_i \)) and{" "}
          <Link to="viscous-term" smooth={true} offset={-100}>
            Viscous
          </Link>{" "}
          (\( \nabla ^2 \textbf u\)) terms.
        </li>
        <li>
          Use these values to calculate \(\textbf u^*\) from{" "}
          <Link to="eq-44" smooth={true} offset={-100}>
            Eq. 44
          </Link>
          ,
          {String.raw`\[
                \textbf u^*=\textbf u_i+\frac{\Delta t}{\rho}\left(\mu \nabla^2\textbf u_i+\textbf f_i- \rho(\textbf u_i \cdot \nabla \textbf u_i)\right)
            \]`}
        </li>
        <li>
          Use the predicted \(\textbf u^*\) to calculate the{" "}
          <Link to="pressure-gradient" smooth={true} offset={-100}>
            Pressure Gradient
          </Link>{" "}
          using{" "}
          <Link to="eq-46" smooth={true} offset={-100}>
            Eq. 46
          </Link>
          ,
          {String.raw`\[\nabla^2p_{i+1}=\frac{\rho}{\Delta t}\nabla \cdot \textbf u^*\]`}
        </li>

        <li>
          Correct the predicted \(\textbf u ^*\) by substituting everything into{" "}
          <Link to="eq-45" smooth={true} offset={-100}>
            Eq. 45
          </Link>
          , which yields the next iteration's velocity,
          {String.raw`\[
                \textbf u_{i+1}=\textbf u^*+\frac{\Delta t}{\rho}\left(-\nabla p_{i+1}\right)
            \]`}
        </li>
      </ol>
      <strong>However,</strong> there is one more thing to consider: the
      Courant-Friedrichs-Lewy (CFL) condition, which governs the maximum
      timestep \(\Delta t\). A concise video explaining its use is available here (2:08 -
      4:40).
      <iframe
        className="youtube"
        src="https://www.youtube.com/embed/WBWY46ynRk0?si=Gy0ySTKN5qaz1oko&amp;start=128"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <br /><br />
      In summary, the Courant number is defined as:
      {String.raw`\[C_0=\frac{u_{\text{max}} \Delta t}{\Delta x}\]`}
      By limiting \(C_0\) to approximately 1.0, the simulation is prevented from diverging
      due to excessively large time steps. Rearranging for \(\Delta t\) and
      expanding to 2D gives:
      {String.raw`\[
        \Delta t = \frac{\text{CFL}}{\dfrac{u_{\max}}{\Delta x} + \dfrac{v_{\max}}{\Delta y}}
    \]`}
      In code, this is simply:
      <br />
      <br />
      <div className="long-horiz">
        <SyntaxHighlighter
          className="codeblock centered"
          language="rust"
          style={srcery}
          customStyle={{ padding: "20px" }}
          showLineNumbers={false}
        >
          {String.raw`
        
        let dt = self.cfl / (max_ux / self.dx + max_uy / self.dy);
        
        `.trim()}
        </SyntaxHighlighter>
      </div>
      <br />
      <br />
      <strong>
        <em>Finally,</em>
      </strong>{" "}
      substituting this into the four-steps above will yield a simple CFD
      simulation.
    </GenericArticle>
  );
}
