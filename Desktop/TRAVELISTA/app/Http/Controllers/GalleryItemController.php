<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryItemController extends Controller
{
    public function index()
    {
        $items = GalleryItem::with('user')
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($items);
    }

    public function userItems(Request $request)
    {
        $items = GalleryItem::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'image' => 'required|image|max:2048' // Max 2MB
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        $item = GalleryItem::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'image_path' => $path,
            'user_id' => $request->user()->id
        ]);

        return response()->json($item, 201);
    }

    public function updateStatus(Request $request, GalleryItem $item)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $item->update(['status' => $validated['status']]);
        return response()->json($item);
    }

    public function destroy(GalleryItem $item)
    {
        Storage::disk('public')->delete($item->image_path);
        $item->delete();
        return response()->json(null, 204);
    }
} 