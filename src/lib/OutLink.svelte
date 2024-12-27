<script>
  let props = $props()
</script>

<a {...props} target="_blank" rel="noreferrer">
  {@render props.children?.()}
</a>
