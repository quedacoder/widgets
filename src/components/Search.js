import React, { useState, useEffect } from 'react';

const Search = () => {

    // React hook 
    const [term, setTerm] = useState('programming');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(term);
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [term]);

    useEffect(() => {

        const search = async () => {
            fetch('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ action: 'query', list: 'search', origin: '*', format: 'json', srsearch: debouncedTerm}))
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        //get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }

                    setResults(data.query.search);
                })
                .catch(error => {
                    this.setState({ errorMessage: error });
                    console.error('There was an error!', error);
                });       
        }

        search();

    }, [debouncedTerm]);

    const renderedResults = results.map((result) => {
       
        // string templating
        const urlText = `https://en.wikipedia.org?curid=${result.pageid}`;

        return (
            <div key={result.pageid} className="item">
                <div className="right floated content">
                    <a className="ui button" href={urlText}>go</a>
                </div>
                <div className="content">
                    <div className="header">
                        {result.title}
                    </div>
                    <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
                </div>
            </div>
        );
    });

    return (
        <div>
            <div className="ui form">
                <div className="field">
                    <label>Enter Search Term</label>
                    <input 
                        value={term}
                        onChange={e => setTerm(e.target.value)}
                        className="input"/>
                </div>
            </div>
            <div className="ui celled list">{renderedResults}</div>
        </div>
    )
};

export default Search;