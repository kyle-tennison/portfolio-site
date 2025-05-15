import GenericArticle from "../pages/GenericArticle";

import franklinScreenshot from "../assets/franklin-cad.png"

export default function FranklinArticle(){
    return <>
    <GenericArticle 
    
            title="Franklin" date="February 2024" description="All about Franklin: my 3D printed self-balancing robot" readTime="3 minutes" titleImage="https://polybrain.b-cdn.net/contribute-art.png"    
    >

    <h1>Header 1</h1>
    <p>Paragraph</p>
    <h2>Header 2</h2>
    <p>Paragraph</p>
    <h3>Header 3</h3>
    <p>Paragraph</p>
    <h4>Header 4</h4>
    <p>Paragraph</p>
    <h5>Header 5</h5>
    <p>Paragraph</p>
    <p>&emsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac erat non libero pharetra convallis. Vivamus suscipit dignissim neque, nec commodo velit convallis a. Integer varius nulla ac massa malesuada, at lacinia odio tempus. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin cursus, ligula ac porta convallis, tortor lectus placerat ex, a elementum nisi velit id eros.

Sed posuere, magna ut laoreet malesuada, arcu sem tincidunt risus, id laoreet nisl metus at turpis. Morbi luctus justo a nulla sodales, nec sollicitudin nisi sollicitudin. Aenean ac tincidunt nisl. Vivamus rhoncus nisi vel ex sagitt Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac erat non libero pharetra convallis. Vivamus suscipit dignissim neque, nec commodo velit convallis a. Integer varius nulla ac massa malesuada, at lacinia odio tempus. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin cursus, ligula ac porta convallis, tortor lectus placerat ex, a elementum nisi velit id eros.

Sed posuere, magna ut laoreet malesuada, arcu sem tincidunt risus, id laoreet nisl metus at turpis. Morbi luctus justo a nulla sodales, nec sollicitudin nisi sollicitudin. Aenean ac tincidunt nisl. Vivamus rhoncus nisi vel ex sagitt Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac erat non libero pharetra convallis. Vivamus suscipit dignissim neque, nec commodo velit convallis a. Integer varius nulla ac massa malesuada, at lacinia odio tempus. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin cursus, ligula ac porta convallis, tortor lectus placerat ex, a elementum nisi velit id eros. <br/><br/>

Sed posuere, magna ut laoreet malesuada, arcu sem tincidunt risus, id laoreet nisl metus at turpis. Morbi luctus justo a nulla sodales, nec sollicitudin nisi sollicitudin. Aenean ac tincidunt nisl. Vivamus rhoncus nisi vel ex sagitt</p>


    <img src={franklinScreenshot}/>


    <p className="centered">This is a caption where \(e=mc^2\).</p>


    </GenericArticle>
    
    </>
}