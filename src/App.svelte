<script lang="ts">
    import P1 from './tutorial/1.a.svelte'
    const allComponents = import.meta.glob('./tutorial/*.svelte')
    const componentList = []
    let Page = P1
    Object.keys(allComponents).forEach((key) => {
        componentList.push({
            key,
            value: allComponents[key],
        })
    })

    const clickHandler = (fn) => {
        let target = document.getElementById('content')!
        const className = target.className
        const main = document.querySelector('main')
        main.removeChild(target)

        target = document.createElement('div')
        target.id = 'content'
        target.className = className
        main.appendChild(target)
        fn().then((Module) => {
            new Module.default({ target })
        })
    }
</script>

<main>
    <div class="menu">
        <ul>
            {#each componentList as component}
                <li on:mouseup={() => clickHandler(component.value)}>
                    {component.key
                        .split('/')[2]
                        .split('.')
                        .splice(0, 2)
                        .join('.')}
                </li>
            {/each}
        </ul>
    </div>
    <div id="content" class="content">
        <Page />
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
    }
    .menu {
        float: left;
        width: 20%;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: auto;
    }
    .content {
        float: right;
        width: 80%;
    }
    .menu li {
        cursor: pointer;
    }
</style>
