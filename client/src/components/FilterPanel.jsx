const locations = ['Remote', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'San Francisco, CA'];
const categories = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Customer Success', 'Data'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];

export default function FilterPanel({ filters, onChange, onReset }) {
  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="filter-panel" aria-label="Job filters">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="text-button" type="button" onClick={onReset}>
          Reset
        </button>
      </div>

      <label className="field">
        <span>Location</span>
        <select value={filters.location} onChange={(event) => updateFilter('location', event.target.value)}>
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Category</span>
        <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Job type</span>
        <select value={filters.jobType} onChange={(event) => updateFilter('jobType', event.target.value)}>
          <option value="">All types</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Experience</span>
        <select
          value={filters.experienceLevel}
          onChange={(event) => updateFilter('experienceLevel', event.target.value)}
        >
          <option value="">All levels</option>
          {experienceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
