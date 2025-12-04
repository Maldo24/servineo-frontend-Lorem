import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
interface FilterState {
  searchQuery: string;
  recentSearches: string[];
  selectedFixerNames: string[];
  selectedCities: string[];
  selectedJobTypes: string[];
  isAutoSelectedJobType: boolean;
  isAutoSelectedCity: boolean;
  sidebarOpen: boolean;
}

const initialState: FilterState = {
  searchQuery: '',
  recentSearches: [],
  selectedFixerNames: [],
  selectedCities: [],
  selectedJobTypes: [],
  isAutoSelectedJobType: false,
  isAutoSelectedCity: false,
  sidebarOpen: false,
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload.trim();
      if (search) {
        state.recentSearches = [search, ...state.recentSearches.filter((s) => s !== search)].slice(
          0,
          5,
        );
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    toggleFixerName: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      state.selectedFixerNames = state.selectedFixerNames.includes(name)
        ? state.selectedFixerNames.filter((n) => n !== name)
        : [...state.selectedFixerNames, name];
    },
    toggleCity: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      state.selectedCities = state.selectedCities.includes(city)
        ? state.selectedCities.filter((c) => c !== city)
        : [...state.selectedCities, city];
      // Si el usuario selecciona manualmente, marcamos como NO automático
      state.isAutoSelectedCity = false;
    },
    toggleJobType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      state.selectedJobTypes = state.selectedJobTypes.includes(type)
        ? state.selectedJobTypes.filter((t) => t !== type)
        : [...state.selectedJobTypes, type];
      // Si el usuario selecciona manualmente, marcamos como NO automático
      state.isAutoSelectedJobType = false;
    },
    autoSelectJobType: (state, action: PayloadAction<string>) => {
      // Auto-selecciona un tipo de trabajo (usado cuando hay coincidencia en búsqueda)
      state.selectedJobTypes = [action.payload];
      // Marcamos como automático
      state.isAutoSelectedJobType = true;
    },
    clearJobTypeSelection: (state) => {
      // Limpia la selección de tipos de trabajo
      state.selectedJobTypes = [];
      state.isAutoSelectedJobType = false;
    },
    autoSelectCity: (state, action: PayloadAction<string>) => {
      // Auto-selecciona una ciudad (usado cuando hay coincidencia en búsqueda)
      state.selectedCities = [action.payload];
      // Marcamos como automático
      state.isAutoSelectedCity = true;
    },
    clearCitySelection: (state) => {
      // Limpia la selección de ciudad
      state.selectedCities = [];
      state.isAutoSelectedCity = false;
    },
    resetFilters: (state) => {
      state.selectedFixerNames = [];
      state.selectedCities = [];
      state.selectedJobTypes = [];
      state.searchQuery = '';
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  toggleFixerName,
  toggleCity,
  toggleJobType,
  autoSelectJobType,
  clearJobTypeSelection,
  autoSelectCity,
  clearCitySelection,
  resetFilters,
  setSidebarOpen,
} = filterSlice.actions;

export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
export const selectRecentSearches = (state: RootState) => state.filters.recentSearches;
export const selectSelectedFixerNames = (state: RootState) => state.filters.selectedFixerNames;
export const selectSelectedCities = (state: RootState) => state.filters.selectedCities;
export const selectSelectedJobTypes = (state: RootState) => state.filters.selectedJobTypes;
export const selectIsAutoSelectedJobType = (state: RootState) =>
  state.filters.isAutoSelectedJobType;
export const selectIsAutoSelectedCity = (state: RootState) => state.filters.isAutoSelectedCity;
export const selectSidebarOpen = (state: RootState) => state.filters.sidebarOpen;

export default filterSlice.reducer;
