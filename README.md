Template
node 22.12.0

to start

docker-compose up
// when use docker updates really slow, :(

navigate

localhost:3050 - ui

localhost:3050/api - api

## Plans to implement

- [x] Redux basic setup
- [ ] Redux advanced setup
- [ ] Caching based on redux
- [ ] useApiHook?
- [x] useFormHook
- [x] useObserveElementSize
- [x] validation helper
- [x] url builder helper
- [x] HOC withPagination
- [x] HOC withFilters
- [ ] HOC withFilters reflect url changing on filter change
- [x] HOC withDeviceMedia
- [x] ~~HOC withWrapperSize~~ deprecated: to complicated to use, hook is more straight forward
- [ ] Table
- [x] FormFields basic
- [ ] FormFields advanced
- [ ] DropDown
- [x] DropDown with just css simple implementation, work great, but don't set dropdown correctly when anchor is shifted with translate, and not the best browser support yet
- [ ] MultiSelect
- [x] VirtualScroll component // get some performance issues, maybe better to use some library instead, but in this case it will be less flexible
- [ ] Create Authentication flow with email and password, try to use browser hashing functionality
- [ ] Build Authorization Logic
- [ ] Use localForage for cross tab communication
- [ ] Widget communication flow
