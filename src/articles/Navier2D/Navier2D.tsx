import { Link, Element } from 'react-scroll';

import materialElementPhoto from "./material-element.png"
import materialElementDxPhoto from "./material-element-dx.png"
import simAnimation from "./sim-animation.gif"
import carSim from "./car-sim.gif"
import gridDiagram from "./grid-diagram.png"
import rippleAirfoil from "./ripple-airfoil.png"

import GenericArticle from "../../pages/GenericArticle";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { srcery } from 'react-syntax-highlighter/dist/esm/styles/hljs';


export default function Navier2DArticle() {
    return (
        <GenericArticle 
        title="Navier-2D" 
        description="Introductory explanation of solving the Navier-Stokes equation in 2D for a non-compressible Newtonian fluid using finite differences."
        date="May 2025"
        readTime="5 minutes"
        titleImage="https://kyletennison.b-cdn.net/wind-tunnel-background.webp"
        >

        <h1>Overview</h1>

        The <strong>Navier Stokes Equations</strong> are partial differential equations 
        that describe fluid motion. Mathematically, they are expressed as:

        {String.raw`
        \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \nabla \cdot \Big[ \lambda (\nabla \cdot \textbf u) \textbf I \Big] + \textbf a \tag{1} \]
        `}

        By using a computer to solve this equation, we can visualize how a fluid 
        flows around some object. This process is often called CFD, or 
        computational-fluid dynamics (but you already knew that). While the equations 
        seem complicated, they really aren't that bad—and once we figure them out,
        it's relatively straightforward to put them into a computer! 
        
        Below, I walk through the derivation of these equations, allong with the 
        method I used to descretize them in my basic <a href="https://github.com/kyle-tennison/navier-2d">Rust CFD</a>, which
        you can try out yourself. 

        <h3>Preface</h3>

        CFD is a vast field of research; this article provides a very introductary 
        glance into CFD—just enough to help get anyone started with CFD. I'll also 
        not that, as of writing this, I am still an undergraduate and am severly 
        underqualifieid in this subject; however, I still think that the content 
        below can be helpful for people first coming into this field. This is 
        the kind of simple resource I would have wanted when starting myself.

        <h3>Pre-Requisites</h3>

        This article assumes that the reader is comfortable with vector calculus
        and some linear algebra. Time derivatives in the equations below will 
        sometimes be shown with dot notation. Some fundamental physics knowledge 
        is assumed, but also explained.

        <h1>Derivation</h1>

        <h2>Stress Tensors</h2>

        <h3>Material Elements</h3>

        In CFD, for simplicity, we assume that the macroscopic observations of 
        physics (e.g., material properties, forces) apply in the same way when 
        the size of the reference frame is reduced. Really, we're simply neglecting
        the reality that fluids, solids, etc. are composed of a series of small 
        particles (atoms). This is known 
        as <a href="">continuum mechanics</a>, and it allows us to greatly simplify 
        engineering problems.

        In the continuum world, we can imagine that fluids and solids are made up 
        of infinitesimal "material elements" (sometimes called fluid parcels/elements, depending 
        on the context). If we imagine these elements to be rectangular prism shaped,
        we can see which forces act on it:

        <img src={materialElementPhoto}></img>
        <span className="centered">Material Element with annotated stresses.</span>
        <span className="centered"><em>From: <a href="https://en.wikipedia.org/wiki/Cauchy_stress_tensor">Cauchy Stress Tensor</a></em></span>

        <br/>

        As shown in the image above, there are nine Stresses (\(\sigma = F/A\))—three 
        on each face. The subscripts denote axes, where typically \(x=1\), \(y=2\), \(z=3\).   
        Some key things to note: there are two <em>shear</em> stresses per face (i.e. 
        stresses that are in-plane to the face they lay on) and one <em>normal</em> stress
        per face (i.e. stresses that act orthogonal ot the face they lay on). The 
        typical subscript notation {String.raw`\(\sigma _{ab}\)`} has \(a\) be the 
        axis of the face and \(b\) be the direction that the stress points.

        Nine stresses is a lot to handle, so we can assemble them into a 
        Cauchy <strong>Stress Tensor</strong>, which is:

        {String.raw`\[\boldsymbol{\sigma} \equiv \begin{bmatrix}
            \sigma_{xx} & \sigma_{xy} & \sigma_{xz} \\
            \sigma_{yx} & \sigma_{yy} & \sigma_{yz} \\
            \sigma_{zx} & \sigma_{zy} & \sigma_{zz} \\
            \end{bmatrix}  \tag{2} \] `}

        Now, whever we want to find the stress in some direction \(\hat n\) (\vec \sigma_n), 
        all we need to use is:

        {String.raw`\[\vec \sigma_n \cdot \textbf T \tag{3}\]`}

        <h3>Directional Forces</h3>

        Because material elements are imagined to be grouped together, and stresses 
        in a body are rarely uniform; we need a way to account for how the stress 
        might change over the element. This is better shown with an illustration.

        <Element name="material-element-dx">

            <img src={materialElementDxPhoto}/>
        </Element>

        <span className="centered">\(x\)-axis forces illustrated on a material element</span>
        <span className="centered"><em>From: <a href="https://en.wikipedia.org/wiki/Cauchy_momentum_equation">Cauchy Momentum Equation</a></em></span>
        <br/>

        Let's first isolate the <em>green forces</em>. The values <em>at the bottom</em> of
        the material element have the force of:

        {String.raw`\[-\sigma_{yx}dxdz  \tag{4} \] `}

        This is the shear stress {String.raw`\(\sigma_{yx}\)`} (force/area) times 
        the area of the \(dx\cdot dz\) face on the material element, given a partition of force in the x direction
        
        Now, let's compare this to the force <em>at the top</em> of the material element. 
        This is annotated to have a force of:

        <Element name="eq-5">
            <div>{String.raw`\[ \left( \sigma_{yx}+\frac{\partial \sigma_{yx}}{\partial y}dy \right)dxdz  \tag{5} \]`}</div>
        </Element>

        Here, we modify the origional stress {String.raw`\(\sigma_{yx}\)`} by some 
        value {String.raw`\(\frac{\partial \sigma_{yx}}{\partial y} dy \)`} to 
        account for the change in that stress over the length of the stress element. 
        If this seems intuitive, great, but if it isn't, we can prove this using 
        the first two terms of the Taylor seires, which are: 

        {String.raw`\[f(y) \approx f(a) + \frac{df}{dy}\bigg|_{x=a} (y - a) + \underbrace{\cdots}_{\text{neglected}}  \tag{6} \]`}

        Let \(a\) be the \(y\)-value at the <em>bottom</em> of the element and 
        let \(b\) be the \(y\)-value at the <em>top</em> of the element. Then, 
        we'll say that the infinitesimal change in \(y\), which we'll call \(dy\),
        is: \(dy=b-a\). Finally, substitute \(f\) for {String.raw`\( \sigma_{yx} \)`}, 
        and we can see:

        {String.raw`\[\sigma_{yx}(b) \approx \sigma_{yx} (a) + \frac{\partial \sigma_{yx}}{dy}\bigg|_{y=a} dy + \underbrace{\cdots}_{\text{neglected}}  \tag{7} \]`}

        Then, by multiplying the face area \(dx \cdot dz\) by this expression, we 
        get the expression shown in <Link to="eq-5" smooth={true} offset={-100}>Eq. 5</Link>.

        <h3>Net Force</h3>

        The <Link to="material-element-dx" smooth={true} offset={-100}>image above</Link> shows 
        the forces that act in the \(x\)-axis. Summarized, these are:

        {String.raw`
        \[
        \begin{aligned}
        F_x &= \left[ \sigma_{xx} + \frac{\partial \sigma_{xx}}{\partial x} dx \right] dy\,dz - \sigma_{xx} dy\,dz \\
        &\quad + \left[ \sigma_{yx} + \frac{\partial \sigma_{yx}}{\partial y} dy \right] dx\,dz - \sigma_{yx} dx\,dz \\
        &\quad + \left[ \sigma_{zx} + \frac{\partial \sigma_{zx}}{\partial z} dz \right] dx\,dy - \sigma_{zx} dx\,dy \\
        \\
        &= \left( \frac{\partial \sigma_{xx}}{\partial x} dx \right) dy\,dz + \left( \frac{\partial \sigma_{yx}}{\partial y} dy \right) dx\,dz + \left( \frac{\partial \sigma_{zx}}{\partial z} dz \right) dx\,dy \\
        \\
        &= \left( \frac{\partial \sigma_{xx}}{\partial x} + \frac{\partial \sigma_{yx}}{\partial y} + \frac{\partial \sigma_{zx}}{\partial z} \right) dx\,dy\,dz
        
        \end{aligned}
        \]

        \[
        \boxed{F_x= \frac{\partial \sigma_{xx}}{\partial x} dx\,dy\,dz + \frac{\partial \sigma_{yx}}{\partial y} dy\,dx\,dz + \frac{\partial \sigma_{zx}}{\partial z} dz\,dx\,dy} \tag{8}
        \]
        `}


        We can do the same in all axes. Skipping over the algebra, we end up with a 
        vector \( \mathbf F_p \) that represents the net force on the 
        element <em>from surface forces</em>:

        {String.raw`
        \[
        \textbf{F}_p =\begin{bmatrix}
        \frac{\partial\sigma_{xx}}{\partial_x}dxdydz+\frac{\partial \sigma_{yx}}{\partial y}dydxdz+\frac{\partial \sigma_{zx}}{\partial z}dzdxdy\\[1ex]
        \frac{\partial\sigma_{xy}}{\partial_x}dxdydz+\frac{\partial \sigma_{yy}}{\partial y}dydxdz+\frac{\partial \sigma_{zy}}{\partial z}dzdxdy\\[1ex]
        \frac{\partial\sigma_{xz}}{\partial_x}dxdydz+\frac{\partial \sigma_{yz}}{\partial y}dydxdz+\frac{\partial \sigma_{zz}}{\partial z}dzdxdy\\
        \end{bmatrix} \tag{9}
        \]
        `}

        We'll notice that we can represent this using the stress tensor with: 

        {String.raw`\[ \mathbf F_p = (\nabla \cdot \boldsymbol \sigma)dxdydz \tag{10} \]`}

        Then, to account for <em>external forces</em>, we can define \(\mathbf F_m\) as:

        {String.raw`\[\mathbf F_m = \mathbf a \rho \; dxdydz \tag{11} \]`}

        where \(\mathbf a\) is an acceleration field. This is really just an 
        application of Newton's Second Law \(F = ma\), where \(\rho \; dxdydz\) is mass 
        and \(\mathbf a\) is acceleration.

        Combining these two terms, we can say that the net force on the stress element is: 

        <Element name='eq-12'>
            {String.raw`\[ \mathbf F = \mathbf F_m + \mathbf F_p \tag{12}\]`}
        </Element>
            


        <hr /> 
        <h2>Cauchy Momentum Equation</h2>

        <h3>Conservation of Momentum</h3>

        Newton's Second Law of motion states:

        {String.raw`\[\mathbf F = m \boldsymbol{\ddot x}\]`}

        And, the conservation of momentum states:

        {String.raw`\[\boldsymbol p = m \boldsymbol{\dot x}\]`}

        If you take the time derivative of this conservation of momentum, you get:

        {String.raw`\[\boldsymbol {\dot p} = m \boldsymbol{\ddot x}\]`}

        Now, we can see that the time-derivative of momentum has the same 
        right-hand side as Newton's Second Law. From this, it's clear to see that:

        {String.raw`\[\mathbf F = \boldsymbol{\dot p} \tag{13} \]`}

        Substituting <Link to="eq-12" smooth={true} offset={-100}>Eq. 12</Link> into 
        Eq. 13 and re-naming hydrostatic stress \(\sigma _h\) to (mechanical) pressure \(p\) gives:

        {String.raw`\[ \boldsymbol{\dot p}= \mathbf F_p + \mathbf F_m = (\nabla\cdot \boldsymbol{\sigma})dxdydz+\textbf{a}\rho dxdydz \tag{14} \]`}

        We started by saying {String.raw`\(\boldsymbol p = m \boldsymbol{\dot x}\)`}; if we
        not denote velocity as \( \textbf u \), such that {String.raw`\(\textbf u = \boldsymbol{\dot x} \)`},
        we can rewrite Eq. 14 as: 

        {String.raw`
        \[ \boldsymbol{\dot u}m=(\nabla \cdot \boldsymbol{\sigma})dxdydz + \boldsymbol{f}\rho\;dxdydz \]
        `}

        And because \(m = \rho \; dxdydz \), this becomes

        {String.raw`
        \[ \boldsymbol{\dot u}\rho\;dxdydz=(\nabla \cdot \boldsymbol{\sigma})dxdydz + \boldsymbol{f}\rho\;dxdydz \]
        `}

        And, after cancelling \(dxdydz\), we finally get:

        {String.raw`\[
        \boldsymbol{\dot u} \rho = (\nabla \cdot \boldsymbol \sigma) + \mathbf a \rho \tag{15}
        \]`}

        Or, after dividing both sides by \(\rho \) and expressing {String.raw`\(\boldsymbol {\dot u} \)`} as
        a <a href="https://en.wikipedia.org/wiki/Material_derivative">Material Derivative</a> (which 
        is really just acknowledging that velocity will change with both space and time), we 
        get:

        <Element name="eq-16">
            {String.raw`\[
            \boxed{ \frac{D\textbf{u}}{Dt}=\frac{1}{\rho}\nabla\cdot\boldsymbol{\sigma}+\textbf{a} } \tag{16}
            \]`}
        </Element>

        This is the <strong>Cauchy Momentum Equation</strong>, which gives a relatioship 
        between acceleration, mass, and external forces. 

        <h3>Conservation Form</h3>

        The form of the Cauchy Momentum Equation 
        in <Link to="eq-16" smooth={true} offset={-100}>Eq. 16</Link> is known 
        as the <em>non-conservative</em> form. For deriving the Navier-Stokes 
        equations, we'll need to reform the equation just a bit to make things work. <br/>

        First, we need to understand <em>Deviatoric Stress</em> versus <em>Hydrostatic Stress</em>. <br/><br/>


        <strong>Hydrostatic stress</strong> \(\sigma _h\) (aka isotropic/volumetric stress)  is the 
        average <em>normal</em> stress of the tensor. Hydrostaic stress is analogous 
        to pressure; it will squeeze the element uniformily on all sides, but 
        not change its shape. Mathematically, this is represented as:

        {String.raw`\[
        
        \sigma_h = \frac{ \sigma_{11} + \sigma{22} + \sigma_{33} }{3} \tag{17}
        \]`}


        <strong>Deviatoric Stress</strong> \(\boldsymbol \tau \) takes the form of a "stress 
        deviator tensor." These represent the stresses that tend to deform the body.
        The stress tensor \(\boldsymbol \sigma \) can be represented as the sum 
        of these two stresses. We can use this property to define the stress deviator 
        tensor, which is:

        <Element name="eq-18">
            {String.raw`\[
            \begin{aligned}
            \begin{bmatrix}
            \tau _{xx} & \tau _{xy} & \tau _{xz} \\
            \tau _{yx} & \tau _{yy} & \tau _{yz} \\
            \tau _{zx} & \tau _{zy} & \tau _{zz}
            \end{bmatrix}
            &=
            \begin{bmatrix}
            \sigma_{xx} & \sigma_{xy} & \sigma_{xz} \\
            \sigma_{yx} & \sigma_{yy} & \sigma_{yz} \\
            \sigma_{zx} & \sigma_{zy} & \sigma_{zz}
            \end{bmatrix}
            -
            \begin{bmatrix}
            \sigma_h & 0 & 0 \\
            0 & \sigma_h & 0 \\
            0 & 0 & \sigma_h
            \end{bmatrix} \\
            &=
            \begin{bmatrix}
            \sigma_{xx} - \sigma_h & \sigma_{xy} & \sigma_{xz} \\
            \sigma_{yx} & \sigma_{yy} - \sigma_h & \sigma_{yz} \\
            \sigma_{zx} & \sigma_{zy} & \sigma_{zz} - \sigma_h
            \end{bmatrix}.
            \end{aligned} \tag{18}
            \]`}
        </Element>

        Now, because we have two partitions, we can replace \( \boldsymbol \sigma \) with:

        {String.raw`
        \[ \boldsymbol \sigma = \boldsymbol \tau + \sigma _h \mathbf I_3 \tag{19} \]
        `}

        where \(\mathbf I_3 \) is the 3x3 identity matrix.

        Substituting this into <Link to="eq-16" smooth={true} offset={-100}>Eq. 16</Link> gives:

        {String.raw`\[
        \begin{aligned}
        \frac{D\textbf{u}}{Dt} 
        &= \frac{1}{\rho} \nabla \cdot (-p\textbf{I} + \boldsymbol{\tau}) + \textbf{a} \\
        &= \frac{1}{\rho} \left( \nabla \cdot (-p\textbf{I}) + \nabla \cdot \boldsymbol{\tau} \right) + \textbf{a} \\
        &= \frac{1}{\rho} \left( -\nabla p + \nabla \cdot \boldsymbol{\tau} \right) + \textbf{a}\\
        \rho \frac{D\textbf{u}}{Dt}  &=-\nabla p + \nabla \cdot \boldsymbol{\tau}+\rho\textbf{a}
        \end{aligned} \\
        \]`}

        Then, because a <a href="https://en.wikipedia.org/wiki/Material_derivative">Material Derivative</a> is
        defined as {String.raw`\( \frac{Dy}{Dt} \equiv \frac{\partial y}{\partial t} + \textbf{u}\cdot \nabla y \)`}, 
        this expands to:

        <Element name="eq-20">
            {String.raw`\[
            \boxed{\rho\left(\frac{\partial \textbf{u}}{\partial t}\right)+\rho (\textbf{u}\cdot \nabla)\textbf{u}=-\nabla p+\nabla \cdot \boldsymbol \tau + \rho \textbf a} \tag{20}
            \]`}
        </Element>

        This is the <strong>Conservation Form</strong> of the Cauchy Momentum Equation, 
        and this is what we'll use to get to the Navier-Stokes Equations.

        <h2>Newtonian Fluids</h2>

        A Newtonian fluid satisfies the following assumptions:

        <ol>
            <li>The fluid is isotropic</li>
            <li>At rest, \( \nabla \cdot \boldsymbol \tau = 0 \)</li>
            <li>The stress tensor \(\boldsymbol \sigma \) is a linear function of the strain rate tensor (or, equivalently, the velocity gradient)</li>
        </ol>

        Let's unpack this. <br/><br/>

        <h3>1. Isotropy</h3>

        An <strong>isotropic</strong> fluid is simply a fluid with properties that 
        don't change depending on direction. Non-isotropic (anisotropic) properties 
        are easier to conceptualize for solids—like how wood is stronger depending 
        on it's grain direction. Just about all day-to-day fluids that the average 
        person encounters are isotropic.<br/><br/>

        <h3>2. \( \nabla \cdot \boldsymbol \tau = 0 \) at rest</h3>

        Asserting that \( \nabla \cdot \boldsymbol \tau = 0 \) means that, in the absence of motion or deformation, there are no net internal shear forces acting within the fluid. 
        This is simply stating that the fluid will reach static equialibrum if let to rest. We can better see 
        this property with <Link to="eq-20" smooth={true} offset={-100}>Eq. 20</Link> by 
        setting {String.raw`\( \frac{D \mathbf u}{Dt} = \left(\frac{\partial \textbf{u}}{\partial t}\right)+ (\textbf{u}\cdot \nabla) =0  \)`}, which 
        just says that velocity is constant (at zero) at rest.

        {String.raw`\[
        
        \cancel{\rho\left(\frac{\partial \textbf{u}}{\partial t}\right)+\rho (\textbf{u}\cdot \nabla)\textbf{u}}=-\nabla p+\nabla \cdot \boldsymbol \tau + \rho \textbf a = 0

        \]`}

        Which, rearranged is: 

        {String.raw`\[
        
        \nabla \cdot \boldsymbol \tau = \nabla p - \rho \mathbf a \qquad \text{(at rest)}

        \]`}

        So, if \(\nabla \cdot \boldsymbol \tau \) is to be zero, that 
        means \(\nabla p - p \mathbf a \) must also be zero, meaning that Newtonian 
        fluids are fluids whose pressures gradient will balance to match the acceleration 
        field. If there is no acceleration field, we can say that the pressure gradient 
        will be zero, meaning pressure will be uniform across the fluid at rest.

        <h3>3. Strain Rate Tensor</h3>


        The <strong>Strain Tensor</strong> is similar to 
        the stress tensor, but instead of describing the stress in each axis, 
        it describes the strain in each axis:

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

        Strain in 1D is usually shown as \( \epsilon = \Delta L / L\) (where \(L\) is length), which is 
        equivalent to saying \(\epsilon_x = \partial d \partial x \) where \(d\) is 
        the <em>displacement field</em>. 
        
        <em>
            Note, he displacement field is often shown
            as \(u\), but that is reserved for velocity in this article.
        </em>

        In two-dimensions, <em>normal</em> strain still takes the form 
        of {String.raw`\( \epsilon _{xx}=  \frac{\partial u_x}{\partial x} \)`}, {String.raw`\( \epsilon _{yy}=  \frac{\partial u_y}{\partial y} \)`}, etc.. 
        However, <em>shear</em> strain needs to represent angular distortion 
        between axes, and for this reason it's defined 
        as: {String.raw`\( \epsilon_{xy} = \frac{1}{2}(\frac{\partial u_x}{\partial y} + \frac{\partial u_y}{\partial x}) \)`}. 
        You can combine these into the following expression for strain:

        {String.raw`\[
        \epsilon _{ij} = \frac12 (\frac{\partial d_i}{\partial x_j}+\frac{\partial d_j}{\partial x_i}) \tag{22}
        \]`}

        For normal stresses, where \(i=j\), the two terms are equal and expression 
        simplifies into a single term. Otherwise, the two terms account for the angular 
        distortion. Note that this equation is only valid for 2D. You can read more 
        about <a href="https://en.wikipedia.org/wiki/Strain_(mechanics)">strain</a> here. 

        <br/><br/>

        Taking the time derivative of both sides gives:

        {String.raw`\[
        
        \dot \epsilon _{ij} = \frac12 (\frac{\partial u_i}{\partial x_j}+\frac{\partial u_j}{\partial x_i}) \tag{23}

        \]`}

        Which, written in vector form, is:


        <Element name="eq-24">
            {String.raw`\[
            \boxed{\boldsymbol {e} =  \frac{1}{2}\left(\nabla \textbf u + (\nabla \textbf u)^T \right)} \tag{24}
            \]`}
        </Element>

        This is the <strong>Strain-Rate Tensor</strong>, which describes the change 
        in strain with respect to time. You 
        can <a href="https://en.wikipedia.org/wiki/Strain-rate_tensor">read more</a> about 
        this tensor here.

        <br/><br/>

        It should also be noted that the <a href="https://en.wikipedia.org/wiki/Trace_(linear_algebra)">trace</a> of 
        this tensor is can be expressed as:

        <Element name="eq-25">
            {String.raw`\[
            \textbf{tr(e)} = \nabla \cdot \textbf u \tag{25}
            \]`}
        </Element>


        The Stress Deviator Tesnor, first mentioned in <Link to="eq-18" smooth={true} offset={-100}>Eq. 18</Link>, 
        can (for reasons beyond this article's scope) be expressed in terms of 
        the Strain-Rate Tensor. The relationship is fixed by two physical 
        constants \(A\) and \(B\), which are shown below:

        {String.raw`\[
        
        \boldsymbol \tau = A \textbf e + B (\;\textbf{tr(e)}\;)\textbf I \tag{26}

        \]`}

        Physically, it is found that \(A = 2 \mu\) and \(B = \lambda\), 
        where \(\mu\) is <strong>shear viscosity</strong> and \(\lambda\) is <strong>bulk viscosity</strong>.
        Substituting these values into the above equation (26), along with the 
        properties in <Link to="eq-24" smooth={true} offset={-100}>Eq. 24</Link> and 
        <Link to="eq-25" smooth={true} offset={-100}>Eq. 25</Link>, yields:

        {
            String.raw`\[
            
            \boldsymbol \tau = \mu \left( \nabla \textbf u + (\nabla \textbf u)^T \right)+\lambda (\nabla \cdot \textbf u) \textbf I \tag{27}

            \]`
        }

        <em>Finally,</em> by substituting this equation (27) into the Cauchy Momentum Equation 
        defined in <Link to="eq-20" smooth={true} offset={-100}>Eq. 20</Link>, we 
        get the <strong>Navier-Stokes Equations</strong>:

        <Element name="eq-28">
            {
                String.raw`\[
            
                \boxed{\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \nabla \cdot \Big[ \lambda (\nabla \cdot \textbf u) \textbf I \Big] + \textbf a } \tag{28}
            
                \]`
            }
        </Element>

        <h2>Continuity Equation</h2>

        Paired with the Navier-Stokes equation is often a <em>Continuity Equation</em> that 
        enforces the conservatio of mass. I'll quickly derive this equation here. Let us 
        define mass as:

        {String.raw`\[
        m = \iiint\limits_V\rho(\textbf{x},t)dV
        \]`}

        Then, taking the material derivative of both sides gives: 


        {String.raw`\[
        \begin{aligned}
        \frac{Dm}{Dt}&=\frac{D}{Dt} \iiint \limits \rho(\textbf{x}, t)dV\\
        &=\iiint\limits_V\left(\frac{\partial \rho}{\partial t} + \textbf{u} \cdot \nabla \rho \right)dV=\iiint\limits_V\left(\frac{\partial \rho}{\partial t} + \nabla(\rho\textbf{u})\right)dV\\
        &=\iiint\limits_V\left(\underbrace{\frac{\partial \rho}{\partial t} + \nabla(\rho)\cdot \textbf{u}}_{D \rho /D\textbf{u}}+ \rho(\nabla \cdot \textbf{u})   \right) dV\\
        &=\iiint_V\frac{D \rho}{Dt}+\rho(\nabla \cdot \textbf{u})dV = 0 \text{ (because mass is conserved)}
        \end{aligned}
        \]`}

        If some integral over an arbitrary bound will <em>always</em> be zero, 
        then we know the integrand must be zero (<em>This is a mathematical artifact 
        of the <a href="https://en.wikipedia.org/wiki/Fundamental_lemma_of_the_calculus_of_variations">Fundamental Lemma of the Calculus of Variations</a></em>).
        Taking the integrand out of the integral leaves:

        <Element name="eq-29">
            {String.raw`\[
            0=\frac{D\rho}{Dt}+\rho(\nabla \cdot \textbf{u}) \tag{29}
            \]`}
        </Element>

        Which, once the material derivative is expanded, can equivalently be expressed as:

        <Element name="eq-30">
            {String.raw`\[
            \boxed{0=\frac{\partial \rho}{\partial t} + \nabla \cdot ( \rho \textbf{u})} \tag{30}
            \]`}
        </Element>

        This is the <strong>Continuity Equation</strong>, which really just asserts the conservation of mass.

        <h2>Incompressible Flow</h2>

        Hitherto, all the derived equations operate solely on the assumptions 
        made for Isotropic Newtonian fluids. We can reduce these equations significantly 
        by making the assumption that the fluid we are studying is <strong>incompressible</strong>. 
        This is a good assumption for water-based liquids, but a poor assumption 
        for gasses. <strong>
            The rest of this article will operate on the assumption
            that the fluid is incompressible.
        </strong>

        <br/><br/>

        Incompressible fluids have the following ideal properties:

        <ol>
            <li>\(\lambda = 0\)</li>
            <li>\(D\mu / Dt = 0\) (i.e. \(\mu \) is const.)</li>
            <li>\(D \rho / Dt = 0 \) (i.e. \(\rho \) is const.)</li>
        </ol>

        <h3>Reduced Continuity Equation</h3>

        Because \(D \rho / Dt = 0 \), it is easy to see how <Link to="eq-29" smooth={true} offset={-100}>Eq. 29</Link> can reduce:

        <Element name="eq-31">
            {String.raw`
            \[ 0=\cancel{\frac{D\rho}{Dt}}+\rho(\nabla \cdot \textbf{u}) \]
            
            \[ \boxed{0=\nabla \cdot \textbf u} \tag{31} \]
            `}
        </Element>

        This is the <strong>Continuity Equation for Incompressible Fluids</strong>.

        <h3>Reduced Navier Stokes Equations</h3>

        Because \(\lambda = 0\), <Link to="eq-28" smooth={true} offset={-100}>Eq. 28</Link> reduces to:

        {String.raw`
        
        \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \cancel{\nabla \cdot \Big[ \lambda (\nabla \cdot \textbf u) \textbf I \Big]} + \textbf a\]


        \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \nabla \cdot \Big[\mu \left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \textbf a\]
        
        `}
        
        
        Then, because \(\mu\) is a constant, the right-hand side can be re-arranged as:

        {String.raw`
        \[\rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \mu \nabla \cdot \Big[\left(\nabla \textbf u +(\nabla \textbf u)^T\right)\Big]+ \textbf a\]
        `}

        And, because <Link to="eq-31" smooth={true} offset={-100}>Eq. 31</Link> states that 
        \(\nabla \cdot \textbf u = 0\), the term \(\nabla \cdot (\nabla \textbf u + (\nabla \textbf u)^T)\) reduces 
        to \(\nabla ^2 \textbf u\), leaving:

        {String.raw`
        
        \[ \rho\left(\frac{\partial \textbf u }{\partial t}+\textbf u \cdot \nabla \textbf u \right)=-\nabla p + \mu \nabla^2 \textbf u + \textbf a \]

        `}

        Rearranging this equation for \(\partial \textbf u / \partial t\) yields:

        <Element name="eq-32">
            {String.raw`\[
            \boxed{\frac{\partial \textbf u}{\partial t}= - \frac{1}{\rho} \nabla p+ \frac{\mu}{\rho} \nabla ^2 \textbf u + \frac{1}{\rho}\textbf f-(\textbf u \cdot \nabla \textbf u)} \tag{32}
            \]`}
        </Element>

        This is the <strong>Navier-Stokes Equation</strong> for a incompressible 
        fluid. This is the equation that will govern the solution to the CFD simulation. 


        <h1>Numerical Approximation</h1>

        Now that we have derived the analytical form of the Navier stokes equation, 
        all that is left is the discretization of the problem. The following will 
        show the steps to reach a 2D solution, but a similar approach could be 
        used in 3D as well. Code is shown in rust, but it could easily be 
        adapted to any other language. The full example code can be 
        found <a href="https://github.com/kyle-tennison/navier-2d">here</a> on GitHub.


        <img src={carSim}/>
        <span className='centered'>The output animation from the sample code.</span>



        <br/><br/>
        
        <h2>Descretization</h2>

        To begin, we first need to define the space that the simulation will take 
        place. The easiest way to do this is by using a <strong>uniform grid</strong>. 
        Shown below is the basic idea of a descretized 2D grid:

        <Element name="grid-diagram"><img src={gridDiagram}/></Element>
        <span className='centered'>3x3 uniform-grid descretization</span>

        In a computer, this grid will be represented by a matrix. For this reason, 
        we define the \((0,0)\) point at the top left-corner (i.e. row=0, col=0).
        I also denoted the two axes notations, those being the \(x, y\) axes 
        and the \(i, j\) axes. The primary difference here is the ordering:
        in matrices, we index first rows, then cols \((i, j)\); whereas in cartesian space, we 
        tend to index the x-axis first, then the y-axis \((x, y)\). It's a subtle 
        difference, but mixing the two up can lead to a lot of confusion.

        <h2>Gradients</h2>
        The <strong>Gradient</strong> of a function is simply a 
        vector:

        {String.raw`
        \[
        \nabla f(\mathbf{x}) = \left[ \frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \dots, \frac{\partial f}{\partial x_n} \right]^T \tag{33}
        \]
        `}

        Each term {String.raw`\( {\partial f} / {\partial x_n} \)`} needs to be 
        calculated at each point of the descretized grid. For this reason, each 
        of these terms are also matrices, which I'll henceforth refer to 
        as <strong>Scalar Fields</strong>—i.e. a 2D field with a scalar value at 
        each point. Because the above equation gives a <em>vector</em> of <em>scalar fields</em>, we end 
        up with a <strong>Vector Field</strong>—i.e. a 2D field with a vector value at each point. 

        <br/><br/>

        To compute the gradient of a 2D function (which is also just a Scalar Field), 
        we can compute the gradient in each direction separately, then stack 
        the two together afterwards. There are a few methods in which we can do this; 
        the two of particular interest in this article are: Finite Differences and 
        Upwind Schemes. 

        <br/><br/>

        The <strong>Finite Difference Method</strong> (FDM) method is the most popular way 
        to numerically aproximate a derivative. Analytically, derivatives are 
        defined as:

        {String.raw`\[
        f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h} \tag{34}
        \]`}

        As \(h \to 0\), the value of \(f'(x)\) approaches its true analytical value. 
        If we let \(h\) remain as some finite, near but nonzero quantity, we can approximate 
        the derivative using the <em>forward finite difference</em>, which is 
        similarly:

        <Element name="eq-35">
            {String.raw`\[
            f'(x) \approx \frac{f(x + h) - f(x)}{h} \tag{35}
            \]`}
        </Element>

        If we don't know \(f(x+h)\), we can also use an <em>backwards finite difference</em>, which is:
        <Element name="eq-36">
            {String.raw`\[
            f'(x) \approx \frac{f(x) - f(x - h)}{h} \tag{36}
            \]`}
        </Element>


        If we know both \(f(x+h)\) and \(f(x-h)\), we can improve our approximation 
        by taking the average of both. This is called the <em>central finite difference</em>.
        <Element name="eq-37">
            {String.raw`\[
            f'(x) \approx \frac{f(x + h) - f(x - h)}{2h} \tag{37}
            \]`}
        </Element>
        
        The function below uses the <em>central finite difference</em> for each node (i.e. a point on the grid) 
        where both \(f(x+h)\) and \(f(x-h)\) are known, but falls back to either 
        the <em>forwards</em> or <em>backwards finite difference</em> methods
        for nodes that lay on the edge of the grid, where only \(f(x+h)\) <em>or</em> \(f(x-h)\) is known.

        <br/><br/>


        {/* TODO: This overflows on mobile; so do equations */}
        <SyntaxHighlighter className="codeblock centered" language="rust" style={srcery} customStyle={{padding: "20px"}} showLineNumbers={true}>
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

    // Create a new scalar field for the ouput gradient
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

            <br/>
            <span className='centered'>Rust implementation for a finite-difference gradient (x-axis only).</span>

        <br/>

        Then, the same can be accomplished in the y-axis: <br/><br/>

        <SyntaxHighlighter className="codeblock centered" language="rust" style={srcery} customStyle={{padding: "20px"}} showLineNumbers={true}>
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

        <br/>
        <span className='centered'>Rust implementation for a finite-difference gradient (y-axis only).</span>


        <br/>
        A few things to note: 

        <ol>
            <li>The x-axis boundary are the first and last <em>columns</em>, whereas the y-axis boundary are the first and last <em>rows</em>.</li>
            <li>In this context, the notation <code className='il'>dui_dx</code> and <code className='il'>dui_dy</code> are used; the \(i\) refers to the {String.raw`\(i^{th}\)`} element, not the \(i\) axis <Link to="grid-diagram" smooth={true} offset={-100}>shown above</Link>.</li>
        </ol>

        However, the central finite difference is not perfect. When there is a sharp 
        peak, like the one in the image below, it's easy for the central finite difference 
        to vastly under/over estimate the derivative at certain points. Often, 
        the peak itself will be estimated to have a small derivative, while the immediate surrouding 
        area will have a vastly over estimated derivative. If let to propigate, 
        derivatives quickly approach \(\infty\) and the simulation explodes.


        <img src={"https://upload.wikimedia.org/wikipedia/commons/6/6f/GaussianUpwind2D.gif"} />

        The Navier-Stokes equation's <strong>convective/advective</strong> term 
        ends up with a sharp peak like this, and we can see how this can cause 
        the simulation to diverge.

        {String.raw`\[
            \frac{\partial \textbf u}{\partial t}= - \frac{1}{\rho} \nabla p+ \frac{\mu}{\rho} \nabla ^2 \textbf u + \frac{1}{\rho}\textbf f- \underbrace{(\textbf u \cdot \nabla \textbf u)}_{\text{advection}}
        \]`}

        As mentioned, the peak is underestimated and the immediate surroundings are over estimated. Because 
        the convective term is part of the time step {String.raw`\(\frac{\partial \textbf u}{\partial t}\)`}, the  
        error in it is effectively added to the next velocity frame. An artifact of this is "splitting" of the peak,
        where the origional peak is split into two peaks due to the inaccuracy in the central finite difference. 
        Then, these split peaks propagate with each time step, creating a ripple effect of high and low 
        velocities very close to each other; this phenomenon is shown in the image below:
        
        <img src={rippleAirfoil}/>
        <span className='centered'>Image of FDM ripple (blue is low velocity; white is high).</span>


        To address this issue, we use a <strong>upwind scheme</strong> to calculate the gradient. 
        This method switches between forwards (<Link to="eq-35" smooth={true} offset={-100}>Eq. 35</Link>) and backwards (<Link to="eq-36" smooth={true} offset={-100}>Eq. 36</Link>) finite differences
        depending on the "flow direction". I reccomend reading the <a href="https://en.wikipedia.org/wiki/Upwind_scheme">Wikipedia article</a> for more information.
        At the surface level, this is really just:

        {String.raw`\[
        f'(x) \approx 
        \begin{cases}
        \displaystyle \frac{f(x) - f(x - h)}{h} & \text{if } \alpha > 0 \\
        \displaystyle \frac{f(x + h) - f(x)}{h} & \text{if } \alpha < 0
        \end{cases} \tag{38}
        \]`}

        where \(\alpha\) is the value that we reference for flow direction. In code, we 
        implement this in a similar fassion as the <code className='il'>gradient_x</code> and <code className='il'>gradient_y</code> functions. 

        <br/><br/>

        <SyntaxHighlighter className="codeblock centered" language="rust" style={srcery} customStyle={{padding: "20px"}} showLineNumbers={true}>
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



        



 
        </GenericArticle>
    )
}