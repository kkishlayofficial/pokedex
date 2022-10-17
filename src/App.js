import React, { useEffect, useRef, useState } from "react";
import PokemonCard from "./components/PokemonCard/index";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import FilterDropdown from "./components/FilterDropdown";
import styled from "styled-components";
import FilterIcon from "./components/icons/filter_icon.png";
import { ReactComponent as PlusIcon } from './components/icons/plusIcon.svg';
import { ReactComponent as MinusIcon } from './components/icons/minusIcon.svg';
import { ReactComponent as CancelIcon } from './components/icons/cancelIcon.svg';
import Checkbox from "./components/atoms/checkbox";
import './App.css'

const App = () => {
  const [allPokemons, setAllPokemons] = useState({});
  const [currData, setCurrData] = useState({});
  const loadMore = useRef("https://pokeapi.co/api/v2/pokemon?limit=20");
  const [malePokemon, setMalePokemon] = useState([]);
  const [femalePokemon, setFemalePokemon] = useState([]);
  const [genderlessPokemon, setGenderlessPokemon] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [currentFilterData, setCurrentFilterData] = useState({});
  const [typeList, setTypeList] = useState({});
  const [genderList, setGenderList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [partialTypeFilter, setPartialTypeFilter] = useState([...typeFilter]);
  const [partialGenderFilter, setPartialGenderFilter] = useState([...genderFilter]);
  const [expandTypeFilter, setExpandTypeFilter] = useState(false);
  const [expandGenderFilter, setExpandGenderFilter] = useState(false);

  useEffect(() => {
    let timeout = null;
    const loader = () => {
      if (
        window.scrollY + window.innerHeight + 175 >=
        document.documentElement.scrollHeight
      ) {
        if (timeout) clearInterval(timeout);
        timeout = setTimeout(() => {
          getAllPokemons();
        }, 100);
      }
    };

    getAllPokemons();
    getPokemonGenders();
    window.addEventListener("scroll", loader);
  }, []);

  useEffect(() => {
    if (Object.keys(allPokemons).length) {
      if (typeFilter.length || genderFilter.length || searchInput.length) {
        let data = Object.keys(allPokemons).reduce((init, pokemon) => {
          let flag = typeFilter.length ? false : true,
            flag2 = genderFilter.length ? false : true,
            flag3 = searchInput.length ? false : true;
          typeFilter.forEach((filter) => {
            if (allPokemons[pokemon].types.includes(filter)) {
              flag = true;
              return;
            }
          });
          flag &&
            genderFilter.forEach((filter) => {
              if (allPokemons[pokemon].gender.includes(filter)) {
                flag2 = true;
                return;
              }
            });
          if (
            flag &&
            flag2 &&
            (pokemon.includes(searchInput.toLowerCase()) ||
              allPokemons[pokemon].id == searchInput)
          ) {
            flag3 = true;
          }
          init =
            flag && flag2 && flag3
              ? { ...init, [pokemon]: { ...allPokemons[pokemon] } }
              : { ...init };
          return { ...init };
        }, {});
        setCurrentFilterData({ ...data });
      } else setCurrentFilterData(allPokemons);
    }
  }, [typeFilter, genderFilter, searchInput, Object.keys(allPokemons).length]);

  const getPokemonGenders = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/gender");
    const data = await res.json();
    getFemalePokemon(data.results[0].url);
    getMalePokemon(data.results[1].url);
    getGenderlessPokemon(data.results[2].url);
    let arr = data.results.map((item) => item.name);
    setGenderList([...arr]);
  };

  const getFemalePokemon = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    let arr = data.pokemon_species_details.map((item) => {
      return item.pokemon_species.name;
    });
    setFemalePokemon([...femalePokemon, ...arr]);
  };

  const getMalePokemon = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    let arr = data.pokemon_species_details.map((item) => {
      return item.pokemon_species.name;
    });
    setMalePokemon([...malePokemon, ...arr]);
  };

  const getGenderlessPokemon = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    let arr = data.pokemon_species_details.map((item) => {
      return item.pokemon_species.name;
    });
    setGenderlessPokemon([...genderlessPokemon, ...arr]);
  };

  const getAllPokemons = async () => {
    const res = await fetch(loadMore.current);
    const data = await res.json();
    const { next, results } = data;
    loadMore.current = next;
    createPokemonObject(results);
  };

  const getTypeData = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/type");
    const data = await res.json();
    const newTypeList = await getTypeList(data.results);
    setTypeList({...typeList, ...newTypeList})
  };

  const getTypeList = async (result) => {
    const data = await result.reduce(async (init, pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      let initial = await init;
      let name = data.name;
      let arr = data.damage_relations.double_damage_from.map(
        (item) => item.name
      );
      return { ...initial, [name]: [ ...arr ] };
    }, {});
    return data;
  };

  const createPokemonObject = async (result) => {
    let currPokemonsObj = await populateData(result);
    setCurrData(currPokemonsObj);
  };

  const populateData = async (result) => {
    const data = await result.reduce(async (init, pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      let initial = await init;
      let name = data.name;
      const pokemonObj = createPokemonData(data);
      return { ...initial, [name]: { ...pokemonObj } };
    }, {});
    return data;
  };

  const createPokemonData = (data) => {
    let name = data.name;
    let pokemonObj = {};
    pokemonObj.name = name;
    pokemonObj.id = data.id;
    pokemonObj.weight = data.weight;
    pokemonObj.height = data.height;
    pokemonObj.types = data.types.map((types) => types.type.name);
    pokemonObj.stats = data.stats.map((stats) => {
      return { name: stats.stat.name, base_stat: stats.base_stat };
    });
    pokemonObj.image = data.sprites.other.dream_world.front_default;
    pokemonObj.abilities = data.abilities.map(
      (abilities) => abilities.ability.name
    );
    pokemonObj.gender = [];
    pokemonObj.weakAgainst = [];
    return pokemonObj;
  };

  useEffect(() => {
    addGender();
    addWeakAgainst();
  }, [currData]);

  const addGender = () => {
    let data = currData;
    Object.keys(data).map((pokemon) => {
      if (femalePokemon.includes(pokemon)) {
        data[pokemon].gender.push("female");
      }
      if (malePokemon.includes(pokemon)) {
        data[pokemon].gender.push("male");
      }
      if (genderlessPokemon.includes(pokemon)) {
        data[pokemon].gender.push("genderless");
      }
    });
    setAllPokemons({ ...allPokemons, ...data });
  };

  const addWeakAgainst = () => {
    let data = currData;
    Object.keys(data).map(pokemon => {
      data[pokemon].types.map(item => {
        if(Object.keys(typeList).includes(item)) {
          let arr = typeList[item];
          Object.keys(arr).map(el => {
            if(!data[pokemon].weakAgainst.includes(arr[el])) data[pokemon].weakAgainst.push(arr[el]);
          })
        }
      });
    })
    setAllPokemons({ ...allPokemons, ...data });
  }

  useEffect(() => {
    let timeout = null;
    const loader = () => {
      if (
        window.scrollY + window.innerHeight + 175 >=
        document.documentElement.scrollHeight
      ) {
        if (timeout) clearInterval(timeout);
        timeout = setTimeout(() => {
          getAllPokemons();
        }, 100);
      }
    };

    getAllPokemons();
    getPokemonGenders();
    getTypeData();
    window.addEventListener("scroll", loader);
  }, []);

  const toggle = () => {
    setModalOpen(!modalOpen);
    setPartialTypeFilter([...typeFilter]);
    setPartialGenderFilter([...genderFilter]);
    setExpandTypeFilter(false);
    setExpandGenderFilter(false);
  };

  const handleApplyFilter = () => {
    setTypeFilter([...partialTypeFilter]);
    setGenderFilter([...partialGenderFilter])
    setModalOpen(!modalOpen);
  }

  const handleResetFilter = () => {
    setTypeFilter([]);
    setGenderFilter([]);
    setPartialTypeFilter([]);
    setPartialGenderFilter([]);
  }

  const expandFilter = (filterType) => {
    if(filterType === "type") {
      setExpandTypeFilter(!expandTypeFilter);
    }
    else{
      setExpandGenderFilter(!expandGenderFilter);
    }
  }

  useEffect(() => {
    setPartialTypeFilter([...typeFilter]);
  }, [typeFilter]);

  useEffect(() => {
    setPartialGenderFilter([...genderFilter]);
  }, [genderFilter]);

  return (
    <Pokedex className="pokedex-container">
      <Container className="pt-5 pb-3 pokedex-header-wrapper">
        <PokedexHeader className="pokedex-header">
          <PokedexTitle xs={12} sm={12} lg={3}>
            Pokédex
          </PokedexTitle>
          <Col xs={12} className="d-block d-lg-none">
            <hr className="line-break" />
          </Col>
          <Col xs={1} className="d-none d-sm-block"></Col>
          <PokedexSubtitle
            xs={12}
            sm={12}
            lg={7}
            className="pokedex-subtitle d-flex align-items-center"
          >
            <span className="text-center">
              Search for any Pokémon that exists on the planet
            </span>
          </PokedexSubtitle>
        </PokedexHeader>
      </Container>
      <FilterContainer className="py-3">
        <Row>
          <Col className="search-filter" xs={9} sm={10} lg={6}>
            <div className="filter-title d-none d-lg-block px-2 py-2">
              Search By
            </div>
            <SearchInput
              className="p-2"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              placeholder="Name or Number"
            />
          </Col>
          <Col className="dropdown-filter d-none d-lg-block" lg={3}>
            <div className="filter-title px-2 py-2">Type</div>
            <FilterDropdown
              type = 'type'
              filterList={typeList}
              className="filter type-filter"
              setFilter={setTypeFilter}
            />
          </Col>
          <Col className="dropdown-filter d-none d-lg-block" lg={3}>
            <div className="filter-title px-2 py-2">Gender</div>
            <FilterDropdown
              type = 'gender'
              filterList={genderList}
              className="filter gender-filter"
              setFilter={setGenderFilter}
            />
          </Col>
          <Col xs={2} className="filter-icon d-block d-lg-none">
            <img src={FilterIcon} onClick={toggle} alt="Filter"/>
          </Col>
        </Row>
      </FilterContainer>
      <div className="pokemon-list py-3">
        <Container>
          <Row>
            {Object.keys(currentFilterData).map((pokemon, idx) => {
              return (
                <Col xs={6} md={4} lg={2} key={idx} className="py-3">
                  <PokemonCard
                    id={allPokemons[pokemon].id}
                    name={allPokemons[pokemon].name}
                    image={allPokemons[pokemon].image}
                    type={allPokemons[pokemon].types}
                    gender={allPokemons[pokemon].gender}
                    height={allPokemons[pokemon].height}
                    weight={allPokemons[pokemon].weight}
                    stats={allPokemons[pokemon].stats}
                    abilities={allPokemons[pokemon].abilities}
                    weakness={allPokemons[pokemon].weakAgainst}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
      <FilterModal isOpen={modalOpen} toggle={toggle} className="filter-modal-container">
        <ModalHeader>
          <div className="filter-header">Filters</div>
          <CancelIcon onClick={toggle}/>
        </ModalHeader>
        <ModalBody>
          <div className={`filter ${expandTypeFilter ? 'show' : 'hide'}`}>
            <div className=" title d-flex py-2 justify-content-between align-items-center">
              <div className="filter-name">Type</div>
              <div className="px-5 py-1 selected-filter text-capitalize">{partialTypeFilter.length ? (partialTypeFilter.length > 1 ? `(${partialTypeFilter[0]} + ${partialTypeFilter.length - 1} more)` : `${partialTypeFilter[0]}`) : 'Select Type'}</div>
              {expandTypeFilter ? <MinusIcon onClick={() => expandFilter("type")}/> : <PlusIcon onClick={() => expandFilter("type")}/>}
            </div>
            <div className={`type-filter pt-2 ${expandTypeFilter ? 'd-block' : 'd-none'}`}>
              <Row>
              {Object.keys(typeList).map((item, idx)=>{
                return(
                  <Col xs={6}>
                    <Checkbox label={item} key={idx} tempFilter={partialTypeFilter} setFilter={setPartialTypeFilter}/>
                  </Col>
                )
              })}
              </Row>
            </div>
          </div>
          <div className={`filter my-3 ${expandGenderFilter ? 'show' : 'hide'}`}>
            <div className=" title d-flex py-2 justify-content-between align-items-center">
              <div className="filter-name">Gender</div>
              <div className="px-5 py-1 selected-filter text-capitalize">{partialGenderFilter.length ? (partialGenderFilter.length > 1 ? `(${partialGenderFilter[0]} + ${partialGenderFilter.length - 1} more)` : `${partialGenderFilter[0]}`) : 'Select Gender'}</div>
              {expandGenderFilter ? <MinusIcon onClick={() => expandFilter("gender")}/> : <PlusIcon onClick={() => expandFilter("gender")}/>}
            </div>
            <div className={`type-filter pt-2 ${expandGenderFilter ? 'd-block' : 'd-none'}`}>
              <Row>
              {genderList.map((item, idx)=>{
                return(
                  <Col xs={6}>
                    <Checkbox label={item} key={idx} tempFilter={partialGenderFilter} setFilter={setPartialGenderFilter}/>
                  </Col>
                )
              })}
              </Row>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button size="lg" className="reset" onClick={handleResetFilter}>
            Reset
          </Button>
          <Button size="lg" className="apply" onClick={handleApplyFilter}>
            Apply
          </Button>
        </ModalFooter>
      </FilterModal>
    </Pokedex>
  );
};

export default App;

const Pokedex = styled(Container)`
  .pokdex-header-wrapper {
    .pokedex-header {
      .line-break {
        border: 1px solid #5d5f7e;
      }
    }
  }
`;

const PokedexHeader = styled(Row)``;

const PokedexTitle = styled(Col)`
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
  letter-spacing: 0.06em;
  color: #2e3156;
  border-right: none;
  @media (min-width: 769px) {
    border-right: 1px solid #5d5f7e;
  }
`;

const PokedexSubtitle = styled(Col)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #5d5f7e;
`;

const FilterContainer = styled(Container)`
  margin-top: 0;
  .search-filter {
    @media (max-width: 768px) {
      padding-right: 0;
    }
  }
  .dropdown-filter {
    .filter {
      button {
        width: 100%;
        height: 57px;
      }
      div {
        width: 100%;
        .css-1jllj6i-control {
          display: none;
        }
      }
    }
  }
  .filter-icon {
    cursor: pointer;
    @media (min-width: 641px) {
      padding-left: 27px;
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 57px;
  border: none;
  background: #c9dde2;
  border-radius: 8px;
`;

const FilterModal = styled(Modal)`
  height: 96%;
  
  padding-top: 20px !important;
  .modal-content{
    height: 100%;
    .modal-header{
      h5{
        width: 100%;
        display: flex;
      justify-content: space-between;
      align-items: center;
      }
    }
    .modal-body{
      .filter{
        &.show{
          .title{
          border-bottom: 1px solid rgba(46, 49, 86, 0.15);
        }
        }
        border: 1px solid #2E3156;
        border-radius: 8px;
        padding: 10px 15px;
        .filter-name{
          font-weight: 800;
          font-size: 18px;
          line-height: 21px;
          color: #2E3156;
          padding-right: 15px;
          
        }
        .selected-filter{
          font-weight: 300;
          font-size: 14px;
          line-height: 16px;
          color: #2E3156;
          border-left: 1px solid rgba(46, 49, 86, 0.15);
        }
      }
    }
    .modal-footer{
      justify-content: space-between;
      width: 100%;
      button{
        width: 45%;
        &.reset{
          border: 1px solid #2E3156;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          color: #2E3156;
          background-color: #FFFFFF;
        }
        &.apply{
          background: #2E3156;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          color: #FFFFFF;
        }
      }
    }
  }
`;
