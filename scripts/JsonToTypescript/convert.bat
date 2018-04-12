@echo off
for %%a in (*.json) do (
json2ts %%a >> iqrf-api.d.ts
)