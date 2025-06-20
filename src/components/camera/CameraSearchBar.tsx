'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  defaultValue?: string
  pageSize?: number
}

export const CameraSearchBar = ({ defaultValue = '', pageSize = 5 }: Props) => {
  const [search, setSearch] = useState(defaultValue)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/cameras?search=${search}&page=1&size=${pageSize}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center">
      <Input
        type="text"
        placeholder="Search cameras..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
