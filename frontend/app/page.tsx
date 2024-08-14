'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const router = useRouter();
	const [zipContent, setZipContent] = useState<any>();
	const [zipNode, setZipNode] = useState<any>();
	const [loading, setLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState<string>();
	const [zipTitle, setZipTitle] = useState<string>();

	async function getZipfile() {
		setLoading(true);
		try {
			const response = await fetch('http://localhost:8080/api/zipfile');
			const data = await response.json();
			return data;
		} catch (error) {
			return "Falha ao ler o arquivo ZIP";
		} finally {
			setLoading(false);
		}
	}

	function listContent(content: any, zipContent: any) {
		let list = [];
		for (const key in content) {
			const value = content[key];
			if (value === null) {
				list.push(<File key={key} name={key} zipContent={zipContent} />);
			} else {
				list.push(<Folder key={key} name={key} onClick={() => {
					setSelectedItem(key);
				}} />);
			}
		}

		console.log(list);
		return list;
	}

	useEffect(() => {
		getZipfile().then((data: Object) => {
			const entries = Object.entries(data);
			setZipContent(data);
			const [_title, _content] = entries[0];
			setZipTitle(_title);
			setSelectedItem(_title);
			setZipNode(listContent(_content, data));
		});
	}, []);

	useEffect(() => {
		if (!selectedItem || !zipContent) return;

		const _content = findItem({ content: zipContent, target: selectedItem });
		setZipNode(listContent(_content, zipContent));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedItem]);

	if(loading) return <div>Carregando... </div>

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<ZipExplorerWindow
				fileTitle={zipTitle}
				breadcrumb={findPathTo({ content: zipContent, target: selectedItem })}
				onBreadcrumbClick={(event: any) => setSelectedItem(event.target.value)}>
				{loading ? "Carregando..." : zipNode}
			</ZipExplorerWindow>
		</main>
	);
}

function findPathTo({ content, target }: any): string[] {
	if (!target) return [];
	for (const key in content) {

		const value = content[key];

		if (key === target) return [key];

		if (value === null) return [];

		const checkChildren = findPathTo({ content: value, target });
		if (checkChildren.length === 0) continue;

		else return [key, ...checkChildren];
	}

	return [];
}

function findItem({ content, target }: any): Object | null {
	if (!target) return null;

	for (const key in content) {
		const value = content[key];

		if (key === target) return value;

		if (value === null) continue;

		const checkChildren = findItem({ content: value, target });

		if (checkChildren) return checkChildren;
	}

	return ""
}

function ZipExplorerWindow({ children, fileTitle, breadcrumb = [], onBreadcrumbClick = () => { } }: any) {
	if (!fileTitle || !children) return <>
		ERRO
	</>;

	breadcrumb = breadcrumb.map((name: any, i: number) => {
		return <>
			{i > 0 &&
				<span>{">"}</span>}
			<button key={i} onClick={onBreadcrumbClick} value={name}>{name}</button>
		</>
	});
	return (
		<div className="p-4 bg-slate-100 rounded-lg min-w-[400px] max-w-[1000px] w-full min-h-[600px] max-h-[800px] h-full overflow-auto border border-slate-300">
			<h1 className="text-2xl font-bold mb-4">{fileTitle}</h1>
			<div className="text-md text-slate-500 flex flex-row gap-2">{breadcrumb}</div>
			<ul className="p-4 rounded-lg list-none text-lg">
				{children}
			</ul>
		</div>
	)
}

function Folder({ name, onClick = () => { } }: any) {
	return <li className="hover:bg-slate-200 p-2" onClick={onClick}>
		{name}
	</li>
}

function File({ name, zipContent }: any) {
	const route = useRouter()
	const allowedFormat = ["xml"]
	const format = name.split(".").pop() || "null";

	return <li className="hover:bg-slate-200 p-2" onClick={() => {
		const path = findPathTo({ content: zipContent, target: name }).join(`%2F`);
		console.log(zipContent)
		if (!allowedFormat.includes(format)) return;
		if (!path || path === "") return;
		route.push(`/fileview/${path}`)
	}}>
		{name}
	</li>
}
