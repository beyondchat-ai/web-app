<script lang="ts">
    import ProfileDropdown from "./ProfileDropdown.svelte"
    const { user } = $props()
</script>

<ProfileDropdown {user}/>