import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import './Documentation.css'
import { useNavigate } from "react-router-dom";

const Documentation = ({file}) => {
    const [content, setContent] = useState('');
    const [activeFile, setActiveFile] = useState(file || 'Introduction');
    const [expandedTopics, setExpandedTopics] = useState({});
    const navigate = useNavigate()

    const topics = {
        "Introduction": {
            "file": "example",
            "subtopics": [
                { name: "Installing On System", file: "InstallingOnSystem" },
                { name: "Updating The System", file: "UpdatingTheSystem" },
                { name: "Restoring the Data", file: "InstallingOnSystem" }
            ]
        },
        "Modules": {
            "file": "Modules",
            "subtopics": [
                { name: "Installing Module", file: "InstallingModule" },
                { name: "Deleting Modules", file: "DeletingModules" }
            ]
        }
    };

    useEffect(() => {
        loadContent(activeFile);
    }, [activeFile]);

    const loadContent = (fileName) => {
        import(`../docs/${fileName}.md`)
            .then(res => fetch(res.default))
            .then(res => res.text())
            .then(setContent)
            .catch(err => {
                console.error('Error loading file:', err);
                setContent(`# Error\nCould not load ${fileName}.md`);
            });
    };

    const handleTopicClick = (topicName) => {
        setActiveFile(topics[topicName].file);
        setExpandedTopics(prev => ({
            ...prev,
            [topicName]: !prev[topicName]
        }));
    };

    const handleSubtopicClick = (subtopic) => {
        setActiveFile(subtopic.file);
    };

    const handleAbout = () => navigate('/Vira-Documentation');

    return (
        <>
            {/* Header */}
            <header className="header">
                <h2>VIRA</h2>
                <div className="header-options">
                    <button className="header-button download">Download</button>
                    <button className="header-button about" onClick={handleAbout} >About</button>
                </div>
            </header>
            <div className="documentationContainer">
                <div className="Docnav">
                    <nav className="nav-menu">
                        {Object.entries(topics).map(([topicName, topicData]) => (
                            <div key={topicName} className="nav-topic">
                                <div 
                                    className={`nav-topic-title ${activeFile === topicData.file ? 'active' : ''}`}
                                    onClick={() => handleTopicClick(topicName)}
                                >
                                    <span className="nav-arrow">
                                        {expandedTopics[topicName] ? '▼' : '▶'}
                                    </span>
                                    {topicName}
                                </div>
                                {expandedTopics[topicName] && topicData.subtopics && (
                                    <div className="nav-subtopics">
                                        {topicData.subtopics.map((subtopic) => (
                                            <div
                                                key={subtopic.file}
                                                className={`nav-subtopic ${activeFile === subtopic.file ? 'active' : ''}`}
                                                onClick={() => handleSubtopicClick(subtopic)}
                                            >
                                                {subtopic.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
                <div className="content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </>
    );
}

export default Documentation;