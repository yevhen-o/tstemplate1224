Template
node 22.12.0

to start

docker-compose up
// when use docker updates really slow, :(

navigate

localhost:3050 - ui

localhost:3050/api - api

## Plans to implement

- [ ] useApiHook? // don't see reason to implement right now.
- [ ] FormFields advanced, normalize all Types
- [ ] Widget communication flow
- [x] Setup playwright to handel authorized state, for tests
- [x] Redux basic setup
- [x] Redux advanced setup (Store data under id and create and use default state object if data not provided yet)
- [x] Caching based on redux // It conflicting with abort signal, and don't see way outsource it more
- [x] useFormHook
- [x] useObserveElementSize
- [x] useClickOutside
- [x] hook withContextMenu
- [x] hook useSortWorker // move sort functionality into separate thread
- [x] hook useFilterWorker // move filter functionality into separate thread
- [x] validation helper
- [x] url builder helper
- [x] HOC withPagination
- [x] HOC withFilters // hm... looks hoc is outdated
- [x] HOC withFilters reflect url changing on filter change // also add reflect pagination
- [x] Write localStorage helper to store all client data under uniq key
- [x] HOC withDeviceMedia
- [x] ~~HOC withWrapperSize~~ deprecated: to complicated to use, hook is more straight forward
- [x] Table
- [x] FormFields basic
- [x] DropDown hm implementation much harder that with css only, work correctly when anchor shifted with translate, but instead buggy on scroll
- [x] DropDown with just css simple implementation, work great, but don't set dropdown correctly when anchor is shifted with translate, and not the best browser support yet
- [x] MultiSelect // Should work yet on style improvement and types improvements
- [x] VirtualScroll component // get some performance issues, maybe better to use some library instead, but in this case it will be less flexible
- [x] Add openapi and swagger to api
- [x] Migrate CRA to VITE can confirm VITE is much faster :)
- [x] Use Zustand for toast management, and just practice
- [x] Create Authentication flow with email and password, try to use browser hashing functionality
- [x] Build Authorization Logic
- [x] Use localForage for cross tab communication // use dexie instead as it support subscription for data in indexDb change
- [x] Add Sentry, New Relic, Data Dog // try New Relic for this setup
- [x] Add Playwrite/cypress tests
- [x] Add husky pre push hook for testing and linting
