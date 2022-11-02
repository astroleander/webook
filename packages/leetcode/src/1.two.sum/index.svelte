<script>
  import { writable } from "svelte/store";
  const signal = writable("!");
  let helloList = ["Hello", "Aloha", "你好"];
  let nameList = ["world", "svelte", "webook", "世界"];

  let clear = [];
  let counter = [0, 0];
  let interval = [2000, 3000, 4000];
  const incr = (i) => {
    counter[i] += 1;
  };

  // the `$:` means 're-run whenever these values change'
  $: name = () => nameList[counter[1] % nameList.length];
  // wrongly: won't update
  // let name = () => nameList[counter[1]%nameList.length];

  $: {
    clear.forEach((c) => clearInterval(c));
    // unsubscribe();
    clear[0] = setInterval(() => incr(0), interval[0]);
    clear[1] = setInterval(() => incr(1), interval[1]);
    clear[2] = setInterval(
      () => signal.update((n) => (n.length > 10 ? (n += "!") : "!")),
      interval[2]
    );
  }
  let signal_value;
  const unsubscribe = signal.subscribe((value) => {
    signal_value = value;
  });
</script>

<h1>
  {helloList[counter[0] % helloList.length]}
  {name()}
  {signal_value}
  {$signal}
</h1>
