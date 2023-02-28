<script lang="ts">
  import type { RepoContributor } from '$lib'

  export let contributors: RepoContributor[]
</script>

<ul class="contributors">
  {#each contributors as { avatar_url, html_url, login }}
    <li>
      <a href={html_url}>
        <img src={avatar_url} alt={login} />
      </a>
      <span>{login}</span>
    </li>
  {/each}
</ul>

<style>
  ul.contributors {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    list-style: none;
    padding: 0;
  }
  ul.contributors img {
    width: 60px;
    border-radius: 50%;
    margin: 1ex;
  }
  ul.contributors > li {
    position: relative;
  }
  ul.contributors > li > span {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 2pt 5pt;
    border-radius: 2pt;
    transform: translateX(-50%);
    left: 50%;
    top: 90%;
    z-index: 1;
    white-space: nowrap;
  }
  ul.contributors > li > a:hover + span {
    visibility: visible;
    opacity: 1;
  }
  img:not(:hover) {
    filter: grayscale(100%);
  }
</style>
