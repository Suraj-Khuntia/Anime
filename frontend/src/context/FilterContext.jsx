import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('score_desc');
  const [searchQuery, setSearchQuery] = useState('');

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedSort('score_desc');
    setSearchQuery('');
  };

  return (
    <FilterContext.Provider
      value={{
        selectedGenre,
        setSelectedGenre,
        selectedType,
        setSelectedType,
        selectedStatus,
        setSelectedStatus,
        selectedSort,
        setSelectedSort,
        searchQuery,
        setSearchQuery,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
