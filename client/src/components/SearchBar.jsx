import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search job title or keyword' }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search size={20} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button className="button button-primary" type="submit">
        Search
      </button>
    </form>
  );
}
