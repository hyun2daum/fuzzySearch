<script>
  import { onMount } from 'svelte';
  import { searchTerm, searchResults } from './store';

  let searchTermValue = '';
  let results = [];

  function handleSearch(event) {
    searchTerm.set(event.target.value);
    fetchSearchResults(event.target.value);
  }

  async function fetchSearchResults(term) {
    console.log("term : " + term);
    const response = await fetch(`http://localhost:3000/search?q=${term}`);
    if (response.ok) {
      const data = await response.json();
      console.log("data : " + JSON.stringify(data));
      searchResults.set(data);
    } else {
      console.error('Failed to fetch search results');
    }
  }

  onMount(() => {
    searchResults.subscribe(value => {
      results = value;
    });
  });
</script>

<input type="text" placeholder="Search..." on:input={handleSearch}>

<ul>
  {#each results as item}
    <li>{item.CODE_NM}</li>
  {/each}
</ul>