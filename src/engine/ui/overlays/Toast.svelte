<script lang="ts">
  import { useStores } from '../../stores';
  const { toast } = useStores();
</script>

<div class="toast" class:show={toast.shown}>{toast.msg}</div>
