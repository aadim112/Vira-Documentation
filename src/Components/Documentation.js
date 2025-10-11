import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import './Documentation.css'

const Documentation = ({file}) =>{

    const [content, setContent] = useState('');

    useEffect(() => {
        import(`../docs/${file}.md`)
        .then(res => fetch(res.default))
        .then(res => res.text())
        .then(setContent);
    }, [file]);
    return(
        <>
        {/* Header */}
            <header className="header">
              <h2>VIRA</h2>
              <div className="header-options">
                <button className="header-button download">Download</button>
                <button className="header-button about">About</button>
              </div>
            </header>
            <div className="documentationContainer">
                <div className="Docnav">

                </div>
                <div className="content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </>
    );
}

export default Documentation;