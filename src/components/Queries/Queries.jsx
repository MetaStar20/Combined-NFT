import React, { useState } from "react";

const Queries = (props) => {
  const [tokenIdForOwner, setTokenIdForOwner] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  const [tokenIdForOwnerNotFound, setTokenIdForOwnerNotFound] = useState(false);

  const [tokenIdForCombine, setTokenIdForCombine] = useState("");
  const [tokenIdForCombineNotFound, setTokenIdForCombineNotFound] = useState(
    false
  );
  const [tokenCombineResult, setTokenCombineResult] = useState("");
  const [cryptoBoys, setCryptoBoys] = useState([]);

  const [tokenIdForMetadata, setTokenIdForMetadata] = useState("");
  const [tokenMetadata, setTokenMetadata] = useState("");
  const [tokenMetadataLink, setTokenMetadataLink] = useState("");
  const [tokenIdForMetadataNotFound, setTokenIdForMetadataNotFound] = useState(
    false
  );

  var Boys = [];
  var MetaDatas = [];

  const combineTokens = async (e) => {
    e.preventDefault();
    try {
      let tokens = tokenIdForCombine.split(",");
      for (let i = 0; i < tokens.length; i++) {
        let isExists = await props.cryptoBoysContract.methods
          .getTokenExists(tokens[i])
          .call();
        if (!isExists) {
          setTokenIdForCombineNotFound(true);
          return;
        }
      }

      for (let i = 0; i < tokens.length; i++) {
        const cryptoBoy = await props.cryptoBoysContract.methods
          .allCryptoBoys(parseInt(tokens[i]))
          .call();
        Boys.push(cryptoBoy);
      }
      await getMetaData();

      console.log(MetaDatas);

      let cName = "Combined";
      let price = 0.1;
      let color = MetaDatas[0].metaData.colors;

      MetaDatas.map((metaData) => {
        cName += "-" + metaData.name;
      });

      for (let i = 1; i < MetaDatas.length; i++) {
        for (var attr in MetaDatas[i].metaData.colors) {
          if (MetaDatas[i].metaData.colors[attr])
            color[attr] = MetaDatas[i].metaData.colors[attr];
        }
      }

      console.log(cName);
      console.log(color);

      props.mintMyNFT(color, cName, price);

    } catch (e) {
      console.log(e);
    }
  };

  const getMetaData = async () => {
    if (Boys.length !== 0) {
      for (let cryptoboy of Boys) {
        const result = await fetch(cryptoboy.tokenURI);
        const metaData = await result.json();
        MetaDatas.push(metaData);
      }
    }
  };

  const getTokenOwner = async (e) => {
    e.preventDefault();
    try {
      const owner = await props.cryptoBoysContract.methods
        .getTokenOwner(tokenIdForOwner)
        .call();
      setTokenOwner(owner);
      setTimeout(() => {
        setTokenOwner("");
        setTokenIdForOwner("");
      }, 5000);
    } catch (e) {
      setTokenIdForOwnerNotFound(true);
      setTokenIdForOwner("");
    }
  };

  const getTokenMetadata = async (e) => {
    e.preventDefault();
    try {
      const metadata = await props.cryptoBoysContract.methods
        .getTokenMetaData(tokenIdForMetadata)
        .call();
      setTokenMetadata(
        metadata.substr(0, 60) + "..." + metadata.slice(metadata.length - 5)
      );
      setTokenMetadataLink(metadata);
      setTimeout(() => {
        setTokenMetadata("");
        setTokenIdForMetadata("");
      }, 5000);
    } catch (e) {
      setTokenIdForMetadataNotFound(true);
      setTokenIdForMetadata("");
    }
  };

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>Queries</h5>
        </div>
      </div>
      <div className="p-4 mt-1 border">
        <div className="row">
          <div className="col-md-12">
            <h5>Combine NFTS</h5>
            <form onSubmit={combineTokens}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForCombine}
                  placeholder="Enter token IDs to combine into One ( e.g : 1 ,2 ,3)"
                  onChange={(e) => setTokenIdForCombine(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                C o m b i n e
              </button>
              {tokenIdForCombineNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Non-Existent Token Id</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">{tokenCombineResult}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <h5>Get Token Owner</h5>
            <form onSubmit={getTokenOwner}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForOwner}
                  placeholder="Enter Token Id"
                  onChange={(e) => setTokenIdForOwner(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                Get Owner
              </button>
              {tokenIdForOwnerNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Non-Existent Token Id</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">{tokenOwner}</p>
          </div>
          <div className="col-md-7">
            <h5>Get Token Metadata</h5>
            <form onSubmit={getTokenMetadata}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForMetadata}
                  placeholder="Enter Token Id"
                  onChange={(e) => setTokenIdForMetadata(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                Get Metadata
              </button>
              {tokenIdForMetadataNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Non-Existent Token Id</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">
              <a
                href={`${tokenMetadataLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenMetadata}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queries;
