import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "../colors/colors";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Progress,
} from "reactstrap";
import { ReactComponent as CancelIcon } from '../icons/cancelIcon.svg';

import TextTruncate from 'react-text-truncate';
import ColoredLabel from "../atoms/coloredLabel";
const PokemonCard =(({
    id,
    name,
    image,
    type,
    gender,
    abilities,
    height,
    weight,
    stats,
    weakness
  }) => {
  const [modal, setModal] = useState(false);
  const [display, setDisplay] = useState(false);
  const [eggGroup, setEggGroup] = useState([]);
  const [desc, setDesc] = useState('');
  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if(modal)getEggGroup()
  },[modal])

  const getEggGroup = async() => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      const data = await res.json();
      let arr = data.egg_groups.map(item=>item.name)
      let descArr = data.flavor_text_entries.filter(item=>item.language.name === 'en');
      let updateArr = removeDuplicates(descArr)
      setDesc(updateArr)
      setEggGroup([...arr]);
  }

  const removeDuplicates = (arr) => {
    let newArr = [];
    arr.map(item => {
      if(!newArr.includes(item.flavor_text)) newArr.push(item.flavor_text)
    })
    let joined = newArr.join(' ');
    return joined;
  };


  const bgColor = (type) => {
    if (type.length === 1) {
      return colors[type[0]];
    } else {
      let color1 = `${colors[type[0]]}`;
      let color2 = `${colors[type[1]]}`;
      return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%);`;
    }
  };

  const toggleDesc = () => {
      setDisplay(!display)
  }

  const calculatePokemonHeight = (heightInDm) => {
    const heightInFeet = heightInDm * 0.3280839895;
    const feetToInches =
    parseFloat("0".concat(".", heightInFeet.toString().split(".")[1])) * 12;
    const result = `${parseInt(heightInFeet)}'${Math.round(feetToInches)}"`;
    return result;
  };

  const renderModalBody = () => {
    return (
      <ModalContainer className="container">
        <Row className="justify-content-between align-items-center py-2">
          <Col xs={6} className=" d-block d-sm-none">
            <div className="pokemon-name text-uppercase">{name}</div>
          </Col>
          <Col xs={6} className="d-flex justify-content-end  d-block d-sm-none"><CancelIcon onClick={toggle}/></Col>
        </Row>
        <Row className="d-block d-sm-none py-2">
          <Col xs={12}>
            <div className="pokemon-id">{id}</div>
          </Col>
        </Row>
        <Row className="py-2">
          <Col xs={6} md={5}>
            <PokemonImgContainerModal bgColor={bgColor(type)} onClick={toggle}>
              <PokemonImage>
                <img src={image} alt={name} />
              </PokemonImage>
            </PokemonImgContainerModal>
          </Col>
          <Col xs={6} md={7}>
          <Row className="">
              <Col xs ={6} className="d-flex justify-content-start align-items-center d-none d-md-block mb-3">
                <div className="text-uppercase pokemon-name">{name}</div>
              </Col>
              <Col
                xs ={3}
                className="d-flex justify-content-center align-items-center d-none d-md-block mb-3"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
                >
                <div className="pokemon-id text-center">{id}</div>
              </Col>
              <Col xs ={3} className="d-flex justify-content-end">
              <CancelIcon onClick={toggle} className=" d-none d-md-block mb-3"/>
              </Col>
            </Row>
          <TruncateDesc className="row">
                <TextTruncate
                line={8}
                element="span"
                truncateText="…"
                text={desc}
                textTruncateChild={<a onClick={toggleDesc} href="#">read more</a>}
                className="truncated-text"
                />
            </TruncateDesc>
          </Col>
        </Row>
        <DescRow className="row" show={display}>
            <Col className="desc p-3">
                <div className="d-flex">
                    <div className="w-100">
                        {desc}
                    </div>
                    <div className="w-20"><CancelIcon className="close-desc" onClick={toggleDesc}/></div>
                </div>
            </Col>
        </DescRow>
        <PokeInfo className="row my-3" show={display}>
          <Col>
            <Row className="">
              <Col xs={6} sm={3} className="py-2">
                  <div><b>Height</b></div>
                  <div className="text-capitalize">{calculatePokemonHeight(height)}</div>
              </Col>
              <Col xs={6} sm={3} className="py-2">
                  <div><b>Weight</b></div>
                  <div className="text-capitalize">{weight/10} kg</div>
              </Col>
              <Col xs={6} sm={3} className="py-2">
                  
                  <div><b>{gender.length>1 ? 'Gender(s)' : 'Gender'}</b></div>
                  <div className="text-capitalize">{gender.join(', ')}</div>
              </Col>
              <Col xs={6} sm={3} className="py-2">
                  <div><b>Egg Groups</b></div>
                  <div className="text-capitalize">{eggGroup.join(', ')}</div>
              </Col>
            </Row>
            <Row className="">
              <Col xs={6} sm={3} className="py-2">
                  <div><b>Abilities</b></div>
                  <div className="text-capitalize">{abilities.join(', ')}</div>
              </Col>
              <Col xs={6} sm={3} className="py-2">
              <div><b>Types</b></div>
                  {type.length && type.map( item => {
                    return (<ColoredLabel data={item}/>)
                  })}
              </Col>
              <Col xs={12} sm={6} className="py-2">
                  <div><b>Weak Against</b></div>
                  {weakness.length && weakness.map( item => {
                    return (<ColoredLabel data={item}/>)
                  })}
              </Col>
            </Row>
          </Col>
        </PokeInfo>
        <StatsContainer className="row my-4">
          <StatsTitle>Stats</StatsTitle>
          {stats.map((item, idx) => {
            return (
              <Col key={idx} xs={12} sm={6}>
                <Row className="py-2 align-items-center">
                  <Col xs={3} className="text-capitalize text-truncate">
                    {item.name}
                  </Col>
                  <Col xs={9} className="">
                    <ProgressBar>
                      <Progress className="text-left" value={item.base_stat}>
                        {item.base_stat}
                      </Progress>
                    </ProgressBar>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </StatsContainer>
      </ModalContainer>
    );
  };

  return (
    <PokemonContainer bgColor={bgColor(type)} onClick={toggle}>
      <PokemonImage>
        <img src={image} alt={name} />
      </PokemonImage>
      <PokemonDetail>
        <PokemonName>{name}</PokemonName>
        <PokemonId>{id}</PokemonId>
      </PokemonDetail>
      <ModalStyled
        isOpen={modal}
        toggle={() => setModal(!modal)}
        size="lg"
      >
        <ModalBody className=" p-0 ">{renderModalBody()}</ModalBody>
      </ModalStyled>
    </PokemonContainer>
  );
});

export default PokemonCard;

const PokemonContainer = styled.div`
  height: 250px;
  border: 1px dashed #2e3156;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 15px 0;
  background: ${(props) => props.bgColor};
`;

const PokemonImage = styled.div`
  img {
    height: 120px;
    width: 120px;
  }
`;

const PokemonDetail = styled.div`
  text-align: center;
`;

const PokemonName = styled.div`
  text-transform: capitalize;
`;

const PokemonId = styled.div``;

const ModalContainer = styled.div`
  .pokemon-name{
    font-weight: 800;
    font-size: 30px;
    line-height: 35px;
    letter-spacing: 0.06em;
    color: #2E3156;
  }
  .pokemon-id{
    font-weight: 400;
    font-size: 30px;
    line-height: 35px;
    letter-spacing: 0.06em;
    color: #2E3156;
  }
  max-width: 100vw;
  width: 100%;
  height: 100%;
  background-color: #deeded;
  padding: 20px 35px;
  box-shadow: -10px 4px 130px #2e3156;
  @media (min-width: 769px) {
      width: 75%;
  }
`;

const StatsContainer = styled.div`
  background-color: #b0d2d2;
  padding: 10px 0px;
`;

const StatsTitle = styled.h3`
  padding: 10px;
`;

const ProgressBar = styled.div`
  .progress {
    .progress-bar {
      text-align: left;
      padding: 5px;
      background: #2e3156;
    }
  }
`;

const ModalStyled = styled(Modal)`
    max-width: 100vw;
    width: 100%;
    max-height: 100vh;
    height: 100%;
    margin: 0;
    .modal-content{
        background: none;
        height: 100%;
    }
`;

const DescRow = styled.div`
   display: ${(props) => props.show ? 'block' : 'none'};
   .desc{
        position: absolute;
        background: #2E3156;
        box-shadow: 0px 4px 20px #2E3156;
        border-radius: 8px;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #FFFFFF;
        top: 15%;
        width: 90%;
        .close-desc{
          fill: #FFFFFF;
        }
        @media (min-width: 576px) {
          width: 94%;
          top: 25%;
        }
        @media (min-width: 1023px){
          width: 71%;
          top:25%
        }
    }
`

const TruncateDesc = styled.div`
    .truncated-text{
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
        color: #2E3156;
    }
`

const PokeInfo = styled.div`
   /* display: ${(props) => props.display ? 'none' : 'block'}; */
`

const PokemonImgContainerModal = styled(PokemonContainer)`
    height: 100%;
    img{
        height: 150px;
        width: 150px
    }
`;
